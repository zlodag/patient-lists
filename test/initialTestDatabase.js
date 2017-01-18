module.exports = {
  users : {
    'team-admin-uid': {
      teams: {
        'A-team' : true
      }
    },
    'default-user-uid': {
      teams: {
        'A-team' : true
      },
      applications: {
        'A-team' : true
      }
    },
    'another-normal-user-uid': {
      teams: {
        'A-team' : true
      }
    },
    'valid-applicant-uid': {
      applications: {
        'A-team' : true
      }
    },
    'another-valid-applicant-uid': {
      applications: {
        'A-team' : true
      }
    },
    'another-admin-uid': {
      teams: {
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
        'another-admin-uid': {
          name: "Another team admin",
          admin: true,
          joined: 123452
        },
        'default-user-uid': {
          name: "Team user",
          admin: false,
          joined: 123456
        },
        'another-normal-user-uid': {
          name: "Another team user",
          admin: false,
          joined: 1234567
        }
      },
      applicants: {
        'valid-applicant-uid': "Applicant name",
        'another-valid-applicant-uid': "Another applicant name"
      },
      patients: {
        'ABC1234': true
      },
      problems: {
        'ABC1234': {
          'Existing problem': {
            by: 'another-normal-user-uid',
            at: 192837465,
            active: true,
            qualifiers: {
              'existingProblemChildId': 'Existing problem child'
            }
          }
        }
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
};
