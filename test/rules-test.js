const chai = require('chai');
const targaryen = require('targaryen/plugins/chai');
const expect = chai.expect;
const bolt = require('firebase-bolt');
const fs = require('fs');

const TIMESTAMP = Object.freeze({'.sv': 'timestamp'});
before(function(){
  targaryen.setDebug(true);
  targaryen.setVerbose(false);
  chai.use(targaryen);
  const boltRulesString = fs.readFileSync('./rules.bolt', 'utf-8');
  const rules = bolt.generate(boltRulesString);
  targaryen.setFirebaseRules(rules);
  targaryen.setFirebaseData({
    users : {
      'team-admin-uid': {
        teams: {
          'A-team' : true
        }
      },
      'normal-user-uid': {
        teams: {
          'A-team' : true
        }
      },
      'valid-applicant-uid': {
        applications: {
          'A-team' : true
        }
      },
      'alone-user-uid': {
        teams: {
          'F-team' : true
        }
      }
    },
    teams : {
      'A-team': {
        users: {
          'team-admin-uid': {
            name: "Team admin",
            admin: true,
            joined: 12345
          },
          'normal-user-uid': {
            name: "Team user",
            admin: false,
            joined: 123456
          }
        },
        applicants: {
          'valid-applicant-uid': "Applicant name"
        }
      },
      'F-team': {
        users: {
          'alone-user-uid': {
            name: "Mr. Lonely",
            admin: true,
            joined: 123456
          }
        }
      }
    }
  });

});

describe('User data', function(){

  describe('Team list', function() {
    it('is not readable by an anonymous user', function() {
      expect(null).cannot.read.path('/users/bar/teams');
    });
    it('is not readable by incorrect user', function() {
      expect({uid: 'normal-user-uid'}).cannot.read.path('/users/bar/teams');
    });
    it('is readable by correct user', function() {
      expect({uid: 'bar'}).can.read.path('/users/bar/teams');
    });
  });

  describe('Application list', function() {
    it('is not readable by an anonymous user', function() {
      expect(null).cannot.read.path('/users/bar/applications');
    });
    it('is not readable by incorrect user', function() {
      expect({uid: 'normal-user-uid'}).cannot.read.path('/users/bar/applications');
    });
    it('is readable by correct user', function() {
      expect({uid: 'bar'}).can.read.path('/users/bar/applications');
    });
  });

  describe('Another node', function() {
    it('is not readable by correct user', function() {
      expect({uid: 'bar'}).cannot.read.path('/users/bar/random');
    });
  });

});

describe('User membership:', function(){

  let
  fanoutObject,
  shouldPass,
  authUid;

  beforeEach(function(){
    fanoutObject = {};
    shouldPass = null;
    authUid = 'normal-user-uid';
  });

  afterEach(function(){
    expect(shouldPass).not.to.be.null;
    const authObj = authUid ? {uid: authUid} : null;
    if (shouldPass) expect(authObj).can.patch(fanoutObject).path('/');
    else expect(authObj).cannot.patch(fanoutObject).path('/');
  });

  describe('Creation',function(){

    let joiningUserUid,
    teamToJoin,
    joiningUserTeamIndexValue,
    joiningUserAdminStatus,
    joiningUserName,
    joiningUserTimestamp;

    beforeEach(function(){
      joiningUserUid = 'normal-user-uid';
      teamToJoin = null;
      joiningUserTeamIndexValue = true;
      joiningUserAdminStatus = true;
      joiningUserName = 'Edward';
      joiningUserTimestamp = TIMESTAMP;
    });

    afterEach(function(){
      expect(teamToJoin).not.to.be.null;
      fanoutObject['users/'+joiningUserUid+'/teams/'+teamToJoin] = joiningUserTeamIndexValue;
      fanoutObject['teams/'+teamToJoin+'/users/'+joiningUserUid] = {
        admin: joiningUserAdminStatus,
        name: joiningUserName,
        joined: joiningUserTimestamp
      };
    });

    describe('of new teams', function(){

      beforeEach(function(){
        teamToJoin = 'B-team';
      });

      describe('is allowed', function(){
        afterEach(function(){
          shouldPass = true;
        });
        it('using valid default data', function(){
        });
        it('with arbitrary team name', function(){
          teamToJoin = 'random-team';
        });
        it('with a different user name', function(){
          joiningUserName = 'Bob Geldof';
        });
      });

      describe('is forbidden', function(){
        afterEach(function(){
          shouldPass = false;
        });
        it('by a different user', function(){
          joiningUserUid = 'team-admin-uid';
        });
        it('by an anonymous user', function(){
          authUid = null;
        });
        it('where team already exists', function(){
          teamToJoin = 'A-team';
        });
        it('with an invalid team index', function(){
          joiningUserTeamIndexValue = false;
        });
        it('without a team index', function(){
          joiningUserTeamIndexValue = null;
        });
        it('with a non-admin status', function(){
          joiningUserAdminStatus = false;
        });
        it('with an invalid admin status', function(){
          joiningUserAdminStatus = "yes";
        });
        it('without an admin status', function(){
          joiningUserAdminStatus = null;
        });
        it('with an invalid user name', function(){
          joiningUserName = 11;
        });
        it('without a user name', function(){
          joiningUserName = null;
        });
        it('if joined time is in the past', function(){
          joiningUserTimestamp = Date.now() - 10000;
        });
        it('if timestamp is in the future', function(){
          joiningUserTimestamp = Date.now() + 10000;
        });
        it('without a timestamp', function(){
          joiningUserTimestamp = null;
        });
      });
    });

    describe('of existing teams', function(){

      beforeEach(function(){
        authUid = 'team-admin-uid';
        joiningUserUid = 'valid-applicant-uid';
        teamToJoin = 'A-team';
        joiningUserAdminStatus = false;
        fanoutObject['teams/'+teamToJoin+'/applicants/'+joiningUserUid] = null;
        fanoutObject['users/'+joiningUserUid+'/applications/'+teamToJoin] = null;
      });

      describe('is allowed', function(){

        afterEach(function(){
          shouldPass = true;
        });
        it('using valid default data', function(){
        });
        it('user created as admin', function(){
          joiningUserAdminStatus = true;
        });
        it('with a different user name', function(){
          joiningUserName = 'Peaches Geldof';
        });
      });

      describe('is forbidden', function(){

        afterEach(function(){
          shouldPass = false;
        });
        it('by a non-admin member', function(){
          authUid = 'normal-user-uid';
        });
        it('by a non-member', function(){
          authUid = 'random-user-uid';
        });
        it('by an anonymous user', function(){
          authUid = null;
        });
        it('for a user who has not applied', function(){
          joiningUserUid = 'alone-user-uid';
        });
        it('if application is not deleted');
        it('if application index is not deleted');
        it('if both application and index are not deleted');
        it('if joined time is in the past', function(){
          joiningUserTimestamp = Date.now() - 10000;
        });
        it('if timestamp is in the future', function(){
          joiningUserTimestamp = Date.now() + 10000;
        });
      });
    });

  });

});
//

describe('Application:', function(){
  describe('Creation', function(){
    describe('is allowed', function(){
      it('using valid default data');
    });
    describe('is forbidden', function(){
      it('when user is an existing member');
      it('on behalf of a different user');
      it('with an invalid application index');
      it('without an application index');
    });
  });
  describe('Deletion', function(){
    describe('is allowed', function(){
      it('by applicant');
      it('by team admin');
    });
    describe('is forbidden', function(){
      it('by a non-admin member');
      it('by a non-member');
      it('by an anonymous user');
      it('with an invalid application index');
      it('without an application index');
    });
  });
});
