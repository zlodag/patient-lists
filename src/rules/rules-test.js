const assert = require('assert');
const SANDBOX_APP = require("./sandbox-app");
const simulator = require("firebase-bolt/lib/simulator");

describe('Sandbox app information', function() {
  it('is present', function() {
    assert(SANDBOX_APP);
  });
  it('has an app name defined', function() {
    assert.strictEqual(typeof SANDBOX_APP.name, "string", "'name' must be a string");
    assert(SANDBOX_APP.name.length, "'name' cannot be empty");
  });
  it('has an app secret defined', function() {
    assert.strictEqual(typeof SANDBOX_APP.secret, "string", "'secret' must be a string");
    assert(SANDBOX_APP.secret.length, "'secret' cannot be empty");
  });
});

const team = 'blue';
const nhi1 = 'ABC1234';
const nhi2 = 'EFG5678';
const nhiMissing = 'JLK4325';
const validPatientWithoutWard = {
  firstName: 'John',
  lastName: 'Smith'
};
const validPatientWithWard = {
  firstName: 'Jane',
  lastName: 'Brown',
  ward: '15'
};
const problem1 = 'problem-ID-1';
const task1 = 'task-ID-1';
const comment1 = 'comment-ID-1';
const getInitialData = (uid1, uid2) => {
  return {
    users: {
      [uid1]: {
        teams: {
          [team]: true
        }
      },
      [uid2]: {
        teams: {
          [team]: true
        }
      }
    },
    teams: {
      [team]: {
        users: {
          [uid1]: user1,
          [uid2]: user2
        },
        patients: {
          [nhi1]: validPatientWithWard,
          [nhi2]: validPatientWithoutWard
        }
      }
    }
  };
};
const user1 = {
  name: 'A name',
  admin: true,
  joined: null
};
const user2 = {
  name: 'B name',
  admin: false,
  joined: null
};
var getComment;

const rulesGenerator = (test) => {
  user1.joined = test.TIMESTAMP;
  user2.joined = test.TIMESTAMP;
  getComment = (userId, nhi) => {
    return {
      comment: 'This is a long comment',
      by: userId,
      at: test.TIMESTAMP,
      nhi: nhi || null
    };
  };
  uid = test.uid;
  test.database(SANDBOX_APP.name, SANDBOX_APP.secret);
  test.rules('src/rules/rules.bolt');
};

simulator.rulesSuite("Team and patients creation", test => {
  rulesGenerator(test);
  test("Team and patients creation", rules => {
    rules
      .as('A')
      .at('/teams/' + team + '/users/' + uid('A'))
      .write(user1)
      .fails("as user without existing teamIndex")

      .as('admin')
      .at('/users/' + uid('A') + '/teams/' + team)
      .write(true)
      .succeeds("setting up teamIndex for A as admin")
      .at('/users/' + uid('B') + '/teams/' + team)
      .write(true)
      .succeeds("setting up teamIndex for B as admin")
      .at('/users/' + uid('B') + '/applications/' + team)
      .write(true)
      .succeeds("setting up applicationIndex for B as admin")

      .as('B')
      .at('/teams/' + team + '/users/' + uid('B'))
      .write(user2)
      .fails("as new team but non-admin user with existing teamIndex")

      .as('A')
      .at('/teams/' + team + '/users/' + uid('A'))
      .write(user1)
      .succeeds("as user with existing teamIndex")
      .write(user2)
      .fails("cannot update user")
      .write(null)
      .fails("cannot delete user")

      .as('A')
      .at('/teams/' + team + '/users/' + uid('B'))
      .write(user2)
      .fails("existing member adding another member who has not applied")

      .as('B')
      .at('/teams/' + team + '/applicants/' + uid('B'))
      .write('B proposed name')
      .succeeds("non-existing user can apply with application index")

      .as('B')
      .at('/teams/' + team + '/users/' + uid('B'))
      .write(user2)
      .fails("new user adding self when team already exists")

      .as('A')
      .write(user2)
      .fails("existing member adding another member who has applied, however application must be removed")

      // todo write a succeeding test for an application to be approved by an admin

      .at('/teams/' + team + '/applicants/' + uid('B'))
      .as('A')
      .write('B alternative name')
      .fails("admin cannot edit another user's application name")
      .as('B')
      .write('B alternative name')
      .succeeds("user can edit their own application name")

      .at('/users/' + uid('B') + '/applications/' + team)
      .as('admin')
      .write(null)
      .succeeds("removing applicationIndex for B as admin")

      .at('/teams/' + team + '/applicants/' + uid('B'))
      .as('B')
      .write(null)
      .succeeds("user can delete their own application")
      .as('admin')
      .write('Admin gave this name')
      .succeeds("admin creating application for user")
      .as('A')
      .write(null)
      .succeeds("team admin can delete another user's application")

      .at('/teams/' + team + '/users/' + uid('B'))
      .as('admin')
      .write(user2)
      .succeeds("root adding a member")

      // todo remove application index

      .as('B')
      .at('/teams/' + team + '/users/' + uid('B') + '/name')
      .write('B different name')
      .fails("non-admin user cannot edit name")
      .as('A')
      .write('B different name')
      .succeeds("admin user can edit name")

      .as('B')
      .at('/teams/' + team + '/users/' + uid('B') + '/admin')
      .write(true)
      .fails("non-admin user cannot edit admin status")
      .as('A')
      .write(true)
      .succeeds("admin user can edit admin status")
      .as('B')
      .write(false)
      .fails("admin user cannot remove their own admin status")
      .as('A')
      .write(false)
      .succeeds("admin user can remove another admin's admin status")

      .as('A')
      .at('/teams/' + team + '/users/' + uid('A') + '/joined')
      .write(test.TIMESTAMP)
      .fails("user cannot edit joined time")
      .write(null)
      .fails("user cannot delete joined time")

      .as('C')
      .at('/teams/' + team + '/patients/')
      .read()
      .fails('non-member cannot read patient list')
      .as('B')
      .read()
      .succeeds('member can read patient list')

      .at('/teams/' + team + '/patients/' + 'sdf1324')
      .write(validPatientWithoutWard)
      .fails("invalid NHI")

      .at('/teams/' + team + '/patients/' + nhi1)
      .write(validPatientWithoutWard)
      .succeeds("adding valid patient without ward")

      .at('/teams/' + team + '/patients/' + nhi1 + '/ward')
      .write('Ward 9')
      .succeeds("updating ward")
      .at('/teams/' + team + '/patients/' + nhi1 + '/firstName')
      .write('Steven')
      .succeeds("updating first name")
      .at('/teams/' + team + '/patients/' + nhi1 + '/lastName')
      .write('Crisis')
      .succeeds("updating last name")

      .at('/teams/' + team + '/patients/' + nhi2)
      .write(validPatientWithWard)
      .succeeds("adding valid patient with ward")
    ;
  });
});

simulator.rulesSuite("Team index", test => {
  rulesGenerator(test);
  test("Team index", rules => {
    rules
      .as('A')
      .at('/users/' + uid('A') + '/teams/' + team)
      .write(true)
      .fails("as user without existing team")

      .as('admin')
      .at('/teams/' + team + '/users/' + uid('A'))
      .write(user1)
      .succeeds("as admin")
      .at('/teams/' + team + '/users/' + uid('B'))
      .write(user2)
      .succeeds("as admin")

      .as('A')
      .at('/users/' + uid('A') + '/teams/' + team)
      .write(false)
      .fails("value must be true")
      .write(true)
      .succeeds("as user with existing team")

      .at('/users/' + uid('B') + '/teams/' + team)
      .as('A')
      .write(true)
      .succeeds("existing member adding another member teamIndex")
      .read()
      .fails("another user cannot read the user's data")
      .as('B')
      .read()
      .succeeds("user can read their own data")
    ;
  });
});

simulator.rulesSuite("Problem lists", test => {
  rulesGenerator(test);
  test("Problem lists", rules => {
    rules
      .at('/')
      .as('admin')
      .write(getInitialData(uid('A'), uid('B')))
      .succeeds("valid initial data as admin")

      .at('/teams/' + team + '/problems')
      .as('A')
      .read()
      .fails("member reading all existing team problems")

      .at('/teams/' + team + '/problems/' + nhi1)
      .as('C')
      .read()
      .fails("non-member reading existing patient problems")
      .as('A')
      .read()
      .succeeds("member reading existing patient problems")

      .at('/teams/' + team + '/problems/' + nhiMissing)
      .as('A')
      .push('This is a false problem')
      .fails("member adding problem to a non-existent patient")

      .at('/teams/' + team + '/problems/' + nhi1)
      .as('C')
      .push('This is a first problem')
      .fails("non-member adding problem")
      .as('A')
      .push('This is a second problem')
      .succeeds("member pushing a problem")

      .at('/teams/' + team + '/problems/' + nhi1 + '/' + problem1)
      .write('This is a third problem')
      .succeeds("member creating problem")
      .write('This is a changed problem')
      .succeeds("member updating problem")
      .write(null)
      .succeeds("member deleting problem")
    ;
  });
});

simulator.rulesSuite("Task lists", test => {
  rulesGenerator(test);
  test("Task lists", rules => {
    rules
      .at('/')
      .as('admin')
      .write(getInitialData(uid('A'), uid('B')))
      .succeeds("valid initial data as admin")

      .at('/teams/' + team + '/tasks')
      .as('A')
      .read()
      .fails("member reading all existing team tasks")

      .at('/teams/' + team + '/tasks/' + nhi1)
      .as('C')
      .read()
      .fails("non-member reading existing patient tasks")
      .as('A')
      .read()
      .succeeds("member reading existing patient tasks")

      .at('/teams/' + team + '/tasks/' + nhiMissing)
      .as('A')
      .push('This is a false task')
      .fails("member adding task to a non-existent patient")

      .at('/teams/' + team + '/tasks/' + nhi1)
      .as('C')
      .push('This is a first task')
      .fails("non-member adding task")
      .as('A')
      .push('This is a second task')
      .succeeds("member pushing a task")

      .at('/teams/' + team + '/tasks/' + nhi1 + '/' + task1)
      .write('This is a third task')
      .succeeds("member creating task")
      .write('This is a changed task')
      .succeeds("member updating task")
      .write(null)
      .succeeds("member deleting task")
    ;
  });
});

simulator.rulesSuite("Comments", test => {
  rulesGenerator(test);
  test("Comments", rules => {
    rules
      .at('/')
      .as('admin')
      .write(getInitialData(uid('A'), uid('B')))
      .succeeds("valid initial data as admin")

      .at('/teams/' + team + '/comments')
      .as('C')
      .read()
      .fails("non-member reading all existing team comments")
      .as('A')
      .read()
      .succeeds("member reading all existing team comments")

      .at('/teams/' + team + '/comments/' + comment1)
      .as('C')
      .read()
      .fails("non-member reading existing patient comments")
      .as('A')
      .read()
      .succeeds("member reading existing patient comments")

      .at('/teams/' + team + '/comments/')
      .as('C')
      .push(getComment(uid('C')))
      .fails("non-member adding comment")
      .as('A')
      .push(getComment(uid('B')))
      .fails("member adding comment as another member")
      .push(getComment(uid('A')))
      .succeeds("member adding comment")
      .push(getComment(uid('A'), nhiMissing))
      .fails("member adding comment with missing nhi")
      .push(getComment(uid('A'), nhi1))
      .succeeds("member adding comment with nhi")

      .at('/teams/' + team + '/comments/' + comment1)
      .write(getComment(uid('A')))
      .succeeds("member adding comment")
      .write(getComment(uid('A')))
      .fails("member overwriting comment")
    ;
  });
});
