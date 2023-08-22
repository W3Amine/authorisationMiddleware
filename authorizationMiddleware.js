const Ability = require("../authorization/AuthorizationAbilities");
const { permittedFieldsOf } = require("@casl/ability/extra");
const { Op } = require("sequelize");
const { defineAbility } = require("@casl/ability");
const replacePlaceholders = require("../helpers/CaslConditionsHandler");

// const { Article, User, Tag } = require("../models");
const Models = require("../models");

const checkAuthorization = (modelName) => async (req, res, next) => {
  // get the user data
  const user = req.userData;
  // define the actionsMap array to translate te req.method to the casl method
  const actionsMap = {
    GET: "read",
    POST: "create",
    PUT: "update",
    DELETE: "delete",
  };

  // now define the Subject or the model
  // model = req.url;

  // get the reqBody fields from te request to check
  const reqBody = req.body;
  // get the request params
  const params = req.params;
  // get the params keys
  const paramskeys = Object.keys(params);

  console.log("######################## START Authorization middleware ########################");

  console.log(user);
  console.log(req.method);
  console.log(actionsMap[req.method]);
  console.log(modelName);
  console.log(reqBody);

  //  ((((((((((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))))))))))
  // (((((((((((((((((((((((( Start get The Permission From The DB ))))))))))))))))))))))))))))
  //  ((((((((((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))))))))))
  // to get all the users permissions data
  // mysql : SELECT users.id , users.email , users.RoleId , permissions.id , permissions.description , permissions.action , permissions.model , permissions.fields , permissions.conditions
  // FROM `users` JOIN rolepermission ON users.RoleId = rolepermission.RoleId JOIN permissions ON permissions.id = rolepermission.PermissionId;

  // to get all the roles with the Permissions
  // SELECT roles.id, roles.name, permissions.id, permissions.description, permissions.action, permissions.model, permissions.fields, permissions.conditions
  // FROM `roles` JOIN rolepermission on roles.id = rolepermission.RoleId JOIN permissions ON rolepermission.PermissionId = permissions.id;

  const PermissionData = await Models.Role.findOne({
    attributes: ["id", "name"],
    include: [
      {
        model: Models.Permission,
        attributes: ["id", "description", "action", "model", "fields", "conditions"],
        through: {
          attributes: [],
        },
      },
    ],

    where: {
      id: user.RoleId,
      [Op.or]: [
        {
          [Op.and]: [{ "$permissions.action$": actionsMap[req.method] }, { "$permissions.model$": modelName }],
        },
        {
          [Op.and]: [
            { "$permissions.action$": "manage" },
            {
              [Op.or]: [{ "$permissions.model$": "all" }, { "$permissions.model$": modelName }],
            },
          ],
        },
      ],
    },
  });

  if (!PermissionData) {
    return res.status(403).json({ message: "Unauthorized access PermissionData not found" });
  }

  // return res.status(200).json({ PermissionData });

  // console.log(PermissionData);
  // console.log(
  //   ` can("${PermissionData.Permissions[0].action}", "${PermissionData.Permissions[0].model}", "${JSON.parse(PermissionData.Permissions[0].fields)}",
  // "${JSON.parse(PermissionData.Permissions[0].conditions)}
  // }
  //   ); `
  // );

  // console.log(JSON.parse(PermissionData.Permissions[0].conditions));

  // console.log(PermissionData.id);

  // console.log(JSON.parse(PermissionData.Permissions[0].conditions));

  // await Models.Permission.update(
  //   { fields: JSON.stringify(["isPublished"]) },
  //   {
  //     where: {
  //       id: 23,
  //     },
  //   }
  // );

  // await Models.Permission.update(
  //   {
  //     conditions: JSON.stringify({
  //       userId: "$$user.id$$",
  //       age: 100,
  //       title: "$$title$$",
  //       createdAt: { $lte: "$$today$$" },
  //       status: { $in: ["review", "$$article.ispublished$$"] },
  //       price: { $gte: 10, $lte: "$$lteNumber$$" },
  //     }),
  //   },
  //   {
  //     where: {
  //       id: 23,
  //     },
  //   }
  // );

  // await Models.Permission.update(
  //   {
  //     conditions: JSON.stringify({
  //       userId: "$$user.id$$",
  //    }),
  //   },
  //   {
  //     where: {
  //       id: 23,
  //     },
  //   }
  // );

  // const TheAbility = defineAbility((can, cannot) => {
  //   can(action, model, fields, replacePlaceholders(conditions, realdata));
  //   // can("update", "Article", ["title", "content", "views"], { userId: user.userId });
  // });

  // to get the permisions data from the user model

  //  const PermissionData = await Models.User.findAll({
  //   attributes: ["id", "email", "RoleId"],
  //   include: [
  //     {
  //       model: Models.Role,
  //       attributes: ["name"],

  //       include: [
  //         {
  //           model: Models.Permission,
  //           attributes: ["id", "description", "action", "model", "fields", "conditions"],
  //           through: {
  //             attributes: [],
  //           },
  //         },
  //       ],
  //     },

  //  ((((((((((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))))))))))
  // (((((((((((((((((((((((( END get The Permission From The DB ))))))))))))))))))))))))))))
  //  ((((((((((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))))))))))

  // {{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
  // {{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{ START Create the Casl Ability }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
  // {{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
  realdata = {
    user: user,
    // job: "webdeveloper",
    // title: "joy boy is back lol xd",
    // today: "21/01/2023",
    // lteNumber: 3333,
    // article: {
    //   ispublished: false,
    // },
  };

  // const CustomAbility = (user) =>
  //   defineAbility((can, cannot) => {
  //     // can("read", "Article", { userId: user.userId });
  //     // can("create", "Article");

  //     can("update", "Article", ["title", "content", "views"], { userId: user.userId });
  //     can("delete", "Article", { userId: user.userId });

  //     can("create", "Tag");
  //     can("update", "Tag");
  //   });

  // console.log("PermissionData.Permissions[0].conditions");
  // console.log(replacePlaceholders(JSON.parse(PermissionData.Permissions[0].conditions), realdata));
  // // console.log(JSON.parse(PermissionData.Permissions[0].conditions, realdata));
  // console.log("PermissionData.Permissions[0].conditions");

  const CustomAbility = defineAbility((can, cannot) => {
    for (key in PermissionData.Permissions) {
      action = PermissionData.Permissions[key].action;
      model = PermissionData.Permissions[key].model;
      fields = PermissionData.Permissions[key].fields;
      conditions = PermissionData.Permissions[key].conditions;

      if (fields == null && conditions == null) {
        can(action, model);
      }
      if (fields != null && conditions == null) {
        can(action, model, JSON.parse(fields));
      }
      if (fields == null && conditions != null) {
        can(action, model, replacePlaceholders(JSON.parse(conditions), realdata));
      }
      if (fields != null && conditions != null) {
        can(action, model, JSON.parse(fields), replacePlaceholders(JSON.parse(conditions), realdata));
      }
    }
  });

  // {{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
  // {{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{ END  Create the Casl Ability }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
  // {{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}

  // |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  // |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  // |||||||||||||||||||||||||||||||||||||||| START  TEST THE ABILITY |||||||||||||||||||||
  // |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  // |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

  // testArticle = new Models.Article({ id: 110, userId: 15, content: "joy", isPublished: true });
  // console.log("((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((");

  // console.log(CustomAbility.can("update", testArticle, "isPublished"));

  // console.log("((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((");

  // return res.status(200).json({ data: PermissionData });
  // |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  // |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  // |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  // ||||||||||||||||||||||||||||||||||| END TEST THE ABILITY ||||||||||||||||||||||||||||
  // |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  // |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  // |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

  //======================== Start of defening the value of modelInstance  =================================== //
  // ======================= Start handeling the req.params if exist & if not ======================= ///////
  ///// =================== assign a string with the name of the model ========================= //
  // check if any req param exist if so then get the key of the param
  // and extract its value
  // then get the model by using Sequelize to give as the model class
  // then find by primary key which is the id
  // then assign the model instance value to this variable
  // if no req.param is set then assign the name of the model to the modelInstance varible
  var modelInstance;
  if (paramskeys.length > 0) {
    const Firstparameter = paramskeys[0];
    console.log("First key:", Firstparameter);
    console.log("First param value :", params[Firstparameter]);

    paramValue = params[Firstparameter];

    console.log(Models[modelName]);
    // console.log(await Models[modelName].findAll());

    modelInstance = await Models[modelName].findByPk(paramValue);
    if (!modelInstance) {
      return res.status(404).json({ message: "Not Found." });
    }

    console.log("_____________________________________________________________");
    console.log(modelInstance);
    console.log("_________________________________________________________________");
  } else {
    modelInstance = modelName;
  }

  //======================== END of defening the value of modelInstance  =================================== //
  // ======================= END handeling the req.params if exist & if not ======================= ///////

  // __________________________________________________________________________________
  // Authorizationcheck = Ability(user).can(actionsMap[req.method], modelInstance);
  Authorizationcheck = CustomAbility.can(actionsMap[req.method], modelInstance);
  var checkAbilityAndFields = Authorizationcheck;

  if (!Authorizationcheck) {
    return res.status(404).json({ message: "Unauthorized access check the can." });
  }
  // ************************** Start HANDELING the Permitted fields  ************************* //
  // ************************** Start handeling the req.body if exist & if not ******************* ///////
  abilityFieldsAreEqual = false;

  if (Authorizationcheck) {
    reqBodyKeys = Object.keys(reqBody);
    if (reqBodyKeys.length > 0) {
      const modelAttributes = Object.keys(Models[modelName].rawAttributes);
      console.log("/////////////////////////////////////////////////////////////////");
      console.log(modelAttributes);
      console.log("/////////////////////////////////////////////////////////////////");

      const fieldskeys = { fieldsFrom: (rule) => rule.fields || modelAttributes };
      // const abilityFields = Ability(user);
      const abilityFields = CustomAbility;

      // get the olowed fields from casl rule if no field is defind
      // it will return all the model attributes 'modelAttributes' which means that i can update any field
      const allowedUpdateFields = permittedFieldsOf(abilityFields, actionsMap[req.method], modelInstance, fieldskeys);

      const validKeys = Object.keys(reqBody).filter((key) => modelAttributes.includes(key));

      console.log("Allowed update fields:", allowedUpdateFields);
      console.log("sended  fields but only the valid ones:", validKeys);

      // check if two arrays has the same values regardless to the order
      abilityFieldsAreEqual = validKeys.every((key) => allowedUpdateFields.includes(key));

      var checkAbilityAndFields = Authorizationcheck && abilityFieldsAreEqual;
    }
  }
  console.log(" +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ ");

  console.log("the Authorizationcheck is " + Authorizationcheck);

  console.log(" +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ ");
  console.log(" +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ ");

  console.log(" the abilityFieldsAreEqual is  " + abilityFieldsAreEqual);

  console.log(" +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ ");

  // ************************** END HANDELING the Permitted fields  ************************* //
  // ************************** END handeling the req.body if exist & if not ******************* ///////

  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ //
  // @@@@@@@@@@@@@@@ IF Authorizationcheck && abilityFieldsAreEqual @@@@@@@@@@@@@@@@ //
  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ next() @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ //

  if (checkAbilityAndFields) {
    next();
    console.log(PermissionData);
  } else {
    return res.status(403).json({ message: "Unauthorized access" });
  }
  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ //
  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ //
  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ //

  console.log(".........................................................");
  console.log(modelInstance);
  console.log(actionsMap[req.method]);
  console.log(Authorizationcheck);
  console.log(".........................................................");

  console.log("######################## END Authorization middleware ########################");
};

module.exports = checkAuthorization;

// tests time
