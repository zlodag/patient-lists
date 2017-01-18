const chai = require('chai');
const targaryen = require('targaryen/plugins/chai');
const expect = chai.expect;
const bolt = require('firebase-bolt');
const fs = require('fs');
const initialData = require('./initialTestDatabase');
const TIMESTAMP = Object.freeze({'.sv': 'timestamp'});
const boltRulesString = fs.readFileSync('./rules.bolt', 'utf-8');
const rules = bolt.generate(boltRulesString);
targaryen.setDebug(true);
targaryen.setVerbose(false);
targaryen.setFirebaseRules(rules);
targaryen.setFirebaseData(initialData);
chai.use(targaryen);
let user, path;
beforeEach(function(){
  user = undefined;
  path = undefined;
});
afterEach('user check', function(){
  expect(user).not.to.be.undefined;
});
afterEach('path check', function(){
  expect(path).not.to.be.undefined;
});
describe('Reading', function(){
  let canRead;
  beforeEach(function(){
    canRead = null;
  });
  afterEach(function(){
    expect(canRead).to.be.a('boolean');
    if (canRead) expect(user).can.read.path(path);
    else expect(user).cannot.read.path(path);
  });
  describe('root user info', function() {
    afterEach(function(){
      path = '/users/bob';
    });
    it('is not allowed by self', function() {
      user = {uid: 'bob'};
      canRead = false;
    });
    it('is not allowed by other', function() {
      user = {uid: 'steve'};
      canRead = false;
    });
    it('is not allowed by anonymous', function() {
      user = null;
      canRead = false;
    });
  });
  ['teams', 'applications'].forEach(function(type){
    describe('all user ' + type, function() {
      afterEach(function(){
        path = '/users/bob/' + type;
      });
      it('is allowed by self', function() {
        user = {uid: 'bob'};
        canRead = true;
      });
      it('is not allowed by other', function() {
        user = {uid: 'steve'};
        canRead = false;
      });
      it('is not allowed by anonymous', function() {
        user = null;
        canRead = false;
      });
    });
  });
  describe('another user node', function() {
    afterEach(function(){
      path = '/users/bob/secret';
    });
    it('is not allowed by self', function() {
      user = {uid: 'bob'};
      canRead = false;
    });
    it('is not allowed by other', function() {
      user = {uid: 'steve'};
      canRead = false;
    });
    it('is not allowed by anonymous', function() {
      user = null;
      canRead = false;
    });
  });
  describe('root team info', function() {
    afterEach(function(){
      path = '/teams/A-team/';
    });
    it('is not allowed by admin', function() {
      user = {uid: 'team-admin-uid'};
      canRead = false;
    });
    it('is not allowed by member', function() {
      user = {uid: 'default-user-uid'};
      canRead = false;
    });
    it('is not allowed by non-member', function() {
      user = {uid: 'valid-applicant-uid'};
      canRead = false;
    });
    it('is not allowed by anonymous', function() {
      user = null;
      canRead = false;
    });
  });
  describe('all applicants', function(){
    afterEach(function(){
      path = '/teams/A-team/applicants';
    });
    it('is allowed by admin', function() {
      user = {uid: 'team-admin-uid'};
      canRead = true;
    });
    it('is not allowed by member', function() {
      user = {uid: 'default-user-uid'};
      canRead = false;
    });
    it('is not allowed by non-member', function() {
      user = {uid: 'valid-applicant-uid'};
      canRead = false;
    });
    it('is not allowed by anonymous', function() {
      user = null;
      canRead = false;
    });
  });
  ['users', 'patients', 'comments'].forEach(function(type) {
    describe('all ' + type, function(){
      afterEach(function(){
        path = '/teams/A-team/' + type;
      });
      it('is allowed by admin', function() {
        user = {uid: 'team-admin-uid'};
        canRead = true;
      });
      it('is allowed by member', function() {
        user = {uid: 'default-user-uid'};
        canRead = true;
      });
      it('is not allowed by non-member', function() {
        user = {uid: 'valid-applicant-uid'};
        canRead = false;
      });
      it('is not allowed by anonymous', function() {
        user = null;
        canRead = false;
      });
    });
  });
  ['problems', 'tasks'].forEach(function(type) {
    describe('all ' + type, function() {
      afterEach(function(){
        path = '/teams/A-team/' + type;
      });
      it('is not allowed by admin', function() {
        user = {uid: 'team-admin-uid'};
        canRead = false;
      });
      it('is not allowed by member', function() {
        user = {uid: 'default-user-uid'};
        canRead = false;
      });
      it('is not allowed by non-member', function() {
        user = {uid: 'valid-applicant-uid'};
        canRead = false;
      });
      it('is not allowed by anonymous', function() {
        user = null;
        canRead = false;
      });
    });
    describe(type + ' by patient', function() {
      afterEach(function(){
        path = '/teams/A-team/' + type + '/NHI1234';
      });
      it('is allowed by admin', function() {
        user = {uid: 'team-admin-uid'};
        canRead = true;
      });
      it('is allowed by member', function() {
        user = {uid: 'default-user-uid'};
        canRead = true;
      });
      it('is not allowed by non-member', function() {
        user = {uid: 'valid-applicant-uid'};
        canRead = false;
      });
      it('is not allowed by anonymous', function() {
        user = null;
        canRead = false;
      });
    });
  });
  describe('another node', function(){
    afterEach(function(){
      path = '/teams/A-team/secret';
    });
    it('is not allowed by admin', function() {
      user = {uid: 'team-admin-uid'};
      canRead = false;
    });
    it('is not allowed by member', function() {
      user = {uid: 'default-user-uid'};
      canRead = false;
    });
    it('is not allowed by non-member', function() {
      user = {uid: 'valid-applicant-uid'};
      canRead = false;
    });
    it('is not allowed by anonymous', function() {
      user = null;
      canRead = false;
    });
  });
});
describe('Write/Patch', function(){
  let canWrite, teamName, fanoutObject;
  beforeEach(function(){
    user = {uid : 'default-user-uid'};
    fanoutObject = {};
    canWrite = undefined;
    teamName = undefined;
  });
  afterEach('write status check', function(){
    expect(canWrite).to.be.a('boolean');
  });
  afterEach('teamName check', function(){
    expect(teamName).not.to.be.undefined;
  });
  afterEach('Patch check', function(){
    path = '/';
    if (canWrite) expect(user).can.patch(fanoutObject).path(path);
    else expect(user).cannot.patch(fanoutObject).path(path);
  });
  describe('users', function(){
    describe('team index', function() {
      it('all teams cannot be deleted', function() {
        teamName = 'irrelevant';
        fanoutObject['users/' + user.uid + '/teams'] = null;
        canWrite = false;
      });
      describe('creation', function(){
        const validNewAdminUser = {
          admin: true,
          name: 'Geezer',
          joined: TIMESTAMP
        };
        beforeEach(function() {
          teamName = 'Arbitrary new team name';
        });
        it('is possible', function() {
          fanoutObject['users/' + user.uid + '/teams/' + teamName] = true;
          fanoutObject['teams/' + teamName + '/users/' + user.uid] = validNewAdminUser
          canWrite = true;
        });
        it('is not allowed with invalid value', function() {
          fanoutObject['users/' + user.uid + '/teams/' + teamName] = false;
          fanoutObject['teams/' + teamName + '/users/' + user.uid] = validNewAdminUser
          canWrite = false;
        });
        it('is not allowed without addition to team', function() {
          fanoutObject['users/' + user.uid + '/teams/' + teamName] = true;
          canWrite = false;
        });
      });
      describe('deletion', function(){
        beforeEach(function() {
          teamName = 'A-team';
        });
        it('is allowed with deletion from team', function() {
          fanoutObject['users/' + user.uid + '/teams/' + teamName] = null;
          fanoutObject['teams/' + teamName + '/users/' + user.uid] = null
          canWrite = true;
        });
        it('is not allowed without deletion from team', function() {
          fanoutObject['users/' + user.uid + '/teams/' + teamName] = null;
          canWrite = false;
        });
        it('entire team index cannot be deleted', function(){
          fanoutObject['users/' + user.uid + '/teams'] = null;
          canWrite = false;
        });
      });
    });
    describe('application index', function() {
      it('all applications cannot be deleted', function() {
        teamName = 'irrelevant';
        fanoutObject['users/' + user.uid + '/applications'] = null;
        canWrite = false;
      });
      describe('creation', function(){
        let applicationIndex, applicantName;
        beforeEach(function(){
          teamName = 'F-team';
          applicationIndex = true;
          applicantName = 'Applicant name';
        });
        afterEach(function(){
          fanoutObject['users/' + user.uid + '/applications/' + teamName] = applicationIndex;
          fanoutObject['teams/' + teamName + '/applicants/' + user.uid] = applicantName;
        });
        it('applications can be added with team application', function() {
          canWrite = true;
        });
        it('applications cannot be added with invalid index', function() {
          applicationIndex = false;
          canWrite = false;
        });
        it('applications cannot be added without team application', function(){
          applicantName = null;
          canWrite = false;
        });
      });
      describe('deletion', function(){
        beforeEach(function(){
          user = {uid: 'valid-applicant-uid'};
          teamName = 'A-team';
        });
        afterEach(function(){
          fanoutObject['users/' + user.uid + '/applications/' + teamName] = null;
        });
        it('applications can be deleted with deletion of team application', function() {
          fanoutObject['teams/' + teamName + '/applicants/' + user.uid] = null;
          canWrite = true;
        });
        it('applications cannot be deleted without deletion of team application', function() {
          canWrite = false;
        });
      });
    });
  });
  describe('teams', function(){
    describe('users', function() {
      describe('creating a user', function(){
        let userInfo, onBehalfOfUid, createIndexValue;
        beforeEach(function(){
          userInfo = {
            admin: false,
            name: 'New arbitrary user name',
            joined: TIMESTAMP
          };
          createIndexValue = true;
          onBehalfOfUid = user.uid;
        });
        afterEach(function(){
          fanoutObject['/teams/' + teamName + '/users/' + onBehalfOfUid] = userInfo;
          if (createIndexValue) fanoutObject['/users/' + onBehalfOfUid + '/teams/' + teamName] = true;
        });
        describe('(if team is new)', function(){
          beforeEach(function() {
            teamName = 'New arbitrary team name';
            userInfo.admin = true;
          });
          it('is possible', function(){
            canWrite = true;
          });
          it('is not allowed if not creating self', function(){
            onBehalfOfUid = 'another-person-uid';
            canWrite = false;
          });
          it('is not allowed if not creating self as admin', function(){
            userInfo.admin = false;
            canWrite = false;
          });
          it('is not allowed without creating team index', function(){
            createIndexValue = false;
            canWrite = false;
          });
        });
        describe('(if team exists)', function(){
          let removeApplication,
            removeApplicationIndex;
          beforeEach(function() {
            teamName = 'A-team';
            user = {uid: 'team-admin-uid'};
            onBehalfOfUid = 'valid-applicant-uid';
            userInfo.name = 'Applicant name';
            removeApplication = true;
            removeApplicationIndex = true;
          });
          afterEach(function() {
            if (removeApplication) fanoutObject['/teams/' + teamName + '/applicants/' + onBehalfOfUid] = null;
            if (removeApplicationIndex) fanoutObject['/users/' + onBehalfOfUid + '/applications/' + teamName] = null;
          });
          it('is possible', function(){
            canWrite = true;
          });
          it('is possible to switch users to a different admin', function(){
            user = {uid: 'another-admin-uid'};
            canWrite = true;
          });
          it('is not allowed if non-admin member', function(){
            user = {uid: 'default-user-uid'};
            canWrite = false;
          });
          it('is possible to create as admin', function() {
            userInfo.admin = true;
            canWrite = true;
          });
          it('is not allowed to (re-)create self (i.e. as admin) if not already admin', function(){
            userInfo.admin = true;
            user = {uid: 'valid-applicant-uid'};
            canWrite = false;
          });
          it('is possible to switch users to a different applicant', function(){
            onBehalfOfUid = 'another-valid-applicant-uid';
            canWrite = true;
          });
          it('is not allowed without an existing application', function() {
            onBehalfOfUid = 'alone-user-uid';
            canWrite = false;
          });
          it('is allowed without using existing application name', function() {
            userInfo.name = 'Any name at all';
            canWrite = true;
          });
          it('is not allowed without deleting existing application', function(){
            removeApplication = false;
            canWrite = false;
          });
          it('is not allowed without deleting existing application index', function(){
            removeApplicationIndex = false;
            canWrite = false;
          });
          it('is not allowed without deleting existing application and application index', function(){
            removeApplication = false;
            removeApplicationIndex = false;
            canWrite = false;
          });
          it('is not allowed without creating a team index', function(){
            createIndexValue = false;
            canWrite = false;
          });
          describe('validity check', function(){
            it('check initial data', function(){
              canWrite =  true;
            });
            it('name required', function(){
              delete userInfo.name;
              canWrite = false;
            });
            it('name valid type', function(){
              userInfo.name = 123;
              canWrite = false;
            });
            it('admin required', function(){
              delete userInfo.admin;
              canWrite = false;
            });
            it('admin valid type', function(){
              userInfo.admin = "yes";
              canWrite = false;
            });
            it('joined time required', function(){
              delete userInfo.joined;
              canWrite = false;
            });
            it('joined time valid type', function(){
              userInfo.joined = '2324';
              canWrite = false;
            });
            it('joined time number not now', function(){
              userInfo.joined = Date.now() - 1000;
              canWrite = false;
            });
            it('no additional parameters', function(){
              userInfo.randomProperty = 42;
              canWrite = false;
            });
          });
        });
      });
      describe('updating an entire user is not possible', function() {
        let onBehalfOfUid;
        beforeEach(function() {
          onBehalfOfUid = undefined;
          teamName = 'A-team';
        });
        afterEach(function(){
          expect(onBehalfOfUid).not.to.be.undefined;
          fanoutObject['/teams/' + teamName + '/users/' + onBehalfOfUid] = {
            admin: false,
            joined: TIMESTAMP,
            name: 'new Name'
          };
        });
        it('member updating self', function(){
          onBehalfOfUid = user.uid
          canWrite = false;
        });
        it('admin updating member', function(){
          onBehalfOfUid = 'default-user-uid';
          canWrite = false;
        });
      });
      describe('updating single user properties', function(){
        let onBehalfOfUid, newName, newAdminStatus, newJoined;
        beforeEach(function() {
          teamName = 'A-team';
          onBehalfOfUid = undefined;
          newName = "An alternative name";
          newAdminStatus = false;
          newJoined = TIMESTAMP;
        });
        afterEach(function() {
          expect(onBehalfOfUid).not.to.be.undefined;
        });
        describe('name', function() {
          afterEach(function() {
            fanoutObject['/teams/' + teamName + '/users/' + onBehalfOfUid + '/name'] = newName;
          });
          it('of self is allowed if admin', function(){
            user = {uid : 'team-admin-uid'};
            onBehalfOfUid = user.uid;
            canWrite = true;
          });
          it('of self is not allowed if not admin', function(){
            onBehalfOfUid = user.uid;
            canWrite = false;
          });
          it('of another member is allowed if admin', function(){
            user = {uid : 'team-admin-uid'};
            onBehalfOfUid = 'another-normal-user-uid';
            canWrite = true;
          });
          it('of another member is not allowed if not admin', function(){
            onBehalfOfUid = 'another-normal-user-uid';
            canWrite = false;
          });
          it('cannot be deleted', function(){
            user = {uid : 'team-admin-uid'};
            onBehalfOfUid = user.uid;
            newName = null;
            canWrite = false;
          });
        });
        describe('admin', function() {
          beforeEach(function(){
            onBehalfOfUid = user.uid;
            user = {uid : 'team-admin-uid'};
          });
          afterEach(function() {
            fanoutObject['/teams/' + teamName + '/users/' + onBehalfOfUid + '/admin'] = newAdminStatus;
          });
          it('is possible', function(){
            canWrite = true;
          });
          it('is not allowed if self is non-admin', function(){
            user = {uid : 'another-normal-user-uid'};
            canWrite = false;
          });
          it('is not allowed if admin updating self', function(){
            onBehalfOfUid = user.uid;
            canWrite = false;
          });
          it('cannot be deleted', function(){
            newAdminStatus = null;
            canWrite = false;
          });
        });
        describe('joined', function() {
          beforeEach(function(){
            onBehalfOfUid = user.uid;
            user = {uid : 'team-admin-uid'};
          });
          afterEach(function() {
            fanoutObject['/teams/' + teamName + '/users/' + onBehalfOfUid + '/joined'] = newJoined;
          });
          it('cannot be updated', function(){
            canWrite = false;
          });
          it('cannot be deleted', function() {
            newJoined = null;
            canWrite = false;
          });
        });
      });
      describe('deleting a user', function(){
        let uidToDelete, deleteTeamIndex;
        beforeEach(function(){
          uidToDelete = user.uid;
          teamName = 'A-team';
          deleteTeamIndex = true;
        });
        describe('admin deletes member', function() {
          beforeEach(function(){
            user = {uid : 'team-admin-uid'};
          });
          afterEach(function(){
            fanoutObject['/teams/' + teamName + '/users/' + uidToDelete] = null;
            if (deleteTeamIndex) fanoutObject['/users/' + uidToDelete + '/teams/' + teamName] = null;
          });
          it('is possible', function(){
            canWrite = true;
          });
          it('admin cannot delete self', function(){
            uidToDelete = user.uid;
            canWrite = false;
          });
          it('is not allowed without deleting team index', function(){
            deleteTeamIndex = false;
            canWrite = false;
          });
        });
        describe('member deletes self', function() {
          afterEach(function(){
            fanoutObject['/teams/' + teamName + '/users/' + uidToDelete] = null;
            if (deleteTeamIndex) fanoutObject['/users/' + uidToDelete + '/teams/' + teamName] = null;
          });
          it('is possible', function(){
            canWrite = true;
          });
          it('is not allowed without deleting team index', function(){
            deleteTeamIndex = false;
            canWrite = false;
          });
        });
      });
    });
    describe('applicants', function() {
      describe('creation', function(){
        let createApplicationIndex, applicantName, onBehalfOfUid;
        beforeEach(function(){
          teamName = 'F-team';
          createApplicationIndex = true;
          applicantName = 'Applicant name';
          onBehalfOfUid = user.uid;
        });
        afterEach(function(){
          fanoutObject['teams/' + teamName + '/applicants/' + onBehalfOfUid] = applicantName;
          if (createApplicationIndex) fanoutObject['users/' + onBehalfOfUid + '/applications/' + teamName] = true;
        });
        it('is possible', function() {
          canWrite = true;
        });
        it('is not allowed if user already a team member', function() {
          teamName = 'A-team';
          canWrite = false;
        });
        it('is not allowed to non-existent team', function() {
          teamName = 'non-existent-team';
          canWrite = false;
        });
        it('is not allowed by another user', function(){
          onBehalfOfUid = 'alone-user-uid';
          canWrite = false;
        });
        it('is not allowed without application index', function(){
          createApplicationIndex = false;
          canWrite = false;
        });
        it('updating in the same manner as a fresh create is possible', function() {
          user = {uid: 'valid-applicant-uid'};
          onBehalfOfUid = user.uid;
          teamName = 'A-team';
          applicantName = 'New applicant name';
          canWrite = true;
        });
      });
      describe('deletion', function() {
        let deleteApplicationIndex, onBehalfOfUid;
        beforeEach(function(){
          teamName = 'A-team';
          deleteApplicationIndex = true;
          onBehalfOfUid = 'valid-applicant-uid';
          user = {uid: onBehalfOfUid};
        });
        afterEach(function(){
          fanoutObject['teams/' + teamName + '/applicants/' + onBehalfOfUid] = null;
          if (deleteApplicationIndex) fanoutObject['users/' + onBehalfOfUid + '/applications/' + teamName] = null;
        });
        it('is possible for user to delete application', function(){
          canWrite = true;
        });
        it('is not allowed without deleting application index', function() {
          deleteApplicationIndex = false;
          canWrite = false;
        });
        it('is possible for admin to delete application', function() {
          user = {uid: 'team-admin-uid'};
          canWrite = true;
        });
      });
    });
  });
});
describe.only('problems', function(){
  let teamName,
    nhi,
    existingProblemKey,
    newProblemKey,
    newProblem,
    existingProblemChildKey,
    newProblemChildKey,
    newProblemChild;
  beforeEach(function(){
    teamName = 'A-team';
    nhi = 'ABC1234';
    path = '/teams/' + teamName + '/problems/' + nhi + '/';
    user = {uid : 'default-user-uid'};
    existingProblemKey = 'Existing problem';
    newProblemKey = 'New Problem';
    newProblem = {
      by: user.uid,
      at: TIMESTAMP,
      active: true
    };
    existingProblemChildKey = 'existingProblemChildKey';
    newProblemChildKey = 'newProblemChildKey';
    newProblemChild = 'New problem child';
  });
  it('can create an active problem', function(){
    expect(user).can.write(newProblem).to.path(path + newProblemKey);
  });
  it('can create an inactive problem', function(){
    newProblem.active = false;
    expect(user).can.write(newProblem).to.path(path + newProblemKey);
  });
  it('cannot overwrite a problem', function(){
    expect(user).cannot.write(newProblem).to.path(path + existingProblemKey);
  });
  it('author must be specified', function(){
    newProblem.by = null;
    expect(user).cannot.write(newProblem).to.path(path + newProblemKey);
  });
  it('author must be me', function(){
    newProblem.by = 'nobodyUid';
    expect(user).cannot.write(newProblem).to.path(path + newProblemKey);
  });
  it('author must belong to team', function(){
    newProblem.by = 'nobodyUid';
    user = {uid : newProblem.by};
    expect(user).cannot.write(newProblem).to.path(path + newProblemKey);
  });
  it('timestamp must be specified', function(){
    newProblem.at = null;
    expect(user).cannot.write(newProblem).to.path(path + newProblemKey);
  });
  it('timestamp must be now', function(){
    newProblem.at = 1234;
    expect(user).cannot.write(newProblem).to.path(path + newProblemKey);
  });
  it('active/inactive must be specified', function(){
    newProblem.active = null;
    expect(user).cannot.write(newProblem).to.path(path + newProblemKey);
  });
  it('active/inactive must be valid', function(){
    newProblem.active = 4;
    expect(user).cannot.write(newProblem).to.path(path + newProblemKey);
  });
  it('can toggle active/inactive by patching', function(){
    expect(user).can.patch({
      at: TIMESTAMP,
      by: user.uid,
      active: false
    }).to.path(path + existingProblemKey);
  });
  it('cannot toggle active/inactive without patching anything', function() {
    expect(user).cannot.write(false).to.path(path + existingProblemKey + '/active');
  });
  it('cannot toggle active/inactive without patching timestamp', function(){
    expect(user).cannot.patch({
      by: user.uid,
      active: false
    }).to.path(path + existingProblemKey);
  });
  it('cannot toggle active/inactive without patching user', function(){
    expect(user).cannot.patch({
      at: TIMESTAMP,
      active: false
    }).to.path(path + existingProblemKey);
  });
  it('cannot be problem with extra details', function(){
    newProblem.randomDetail = true;
    expect(user).cannot.write(newProblem).to.path(path + newProblemKey);
  });
  it('can create a problem child by patching', function() {
    expect(user).can.patch({
      at: TIMESTAMP,
      by: user.uid,
      ['qualifiers/' + newProblemChildKey]: newProblemChild
    }).to.path(path + existingProblemKey);
  });
  it('cannot create a problem child without patching anything', function() {
    expect(user).cannot.write(newProblemChild).to.path(path + existingProblemKey + '/qualifiers/' + newProblemChildKey);
  });
  it('cannot create a problem child without patching timestamp', function() {
    expect(user).cannot.patch({
      by: user.uid,
      ['qualifiers/' + newProblemChildKey]: newProblemChild
    }).to.path(path + existingProblemKey);
  });
  it('cannot create a problem child without patching uid', function() {
    expect(user).cannot.patch({
      at: TIMESTAMP,
      ['qualifiers/' + newProblemChildKey]: newProblemChild
    }).to.path(path + existingProblemKey);
  });
  it('newProblemChild must be valid', function() {
    expect(user).cannot.patch({
      at: TIMESTAMP,
      by: user.uid,
      ['qualifiers/' + newProblemChildKey]: 12
    }).to.path(path + existingProblemKey);
  });
  it('can update a problem child by patching', function() {
    expect(user).can.patch({
      at: TIMESTAMP,
      by: user.uid,
      ['qualifiers/' + existingProblemChildKey]: newProblemChild
    }).to.path(path + existingProblemKey);
  });
  it('cannot update a problem child without patching anything', function() {
    expect(user).cannot.write(newProblemChild).to.path(path + existingProblemKey + '/qualifiers/' + existingProblemChildKey);
  });
  it('cannot update a problem child without patching timestamp', function() {
    expect(user).cannot.patch({
      by: user.uid,
      ['qualifiers/' + existingProblemChildKey]: newProblemChild
    }).to.path(path + existingProblemKey);
  });
  it('cannot update a problem child without patching uid', function() {
    expect(user).cannot.patch({
      at: TIMESTAMP,
      ['qualifiers/' + existingProblemChildKey]: newProblemChild
    }).to.path(path + existingProblemKey);
  });
  it('can remove a problem child by patching', function() {
    expect(user).can.patch({
      at: TIMESTAMP,
      by: user.uid,
      ['qualifiers/' + existingProblemChildKey]: null
    }).to.path(path + existingProblemKey);
  });
  it('cannot remove a problem child without anything', function() {
    expect(user).cannot.write(null).to.path(path + existingProblemKey + '/qualifiers/' + existingProblemChildKey);
  });
  it('cannot remove a problem child without patching timestamp', function() {
    expect(user).cannot.patch({
      by: user.uid,
      ['qualifiers/' + existingProblemChildKey]: null
    }).to.path(path + existingProblemKey);
  });
  it('cannot remove a problem child without patching uid', function() {
    expect(user).cannot.patch({
      at: TIMESTAMP,
      ['qualifiers/' + existingProblemChildKey]: null
    }).to.path(path + existingProblemKey);
  });
});

