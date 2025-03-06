exports.constants = {
    VALIDATION_ERROR: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    SUCCESS: 200,
    NOCONTENT: 204,
    STATUS: {
      created: "created",
      submitted: "submitted",
      approved: "approved",
      sentToActivity: "sent_to_generate_activity",
      referredBack: "referred_back",
      generated: "generated",
    },
    APPUSER_STATUS: {
      active: 'Active',
      inActive: 'InActive'
    },
    ROLE_CODE: {
      pm: "PM",
      pmo: "PMO"
    },
    organization: {
      gamingCode: "1000"
    },
    LOGGER_MODULE: {
      dashboard: "dashboard",
      user: "user",
      networkSetup: "network-setup",
      hire: "hire",
      projectMovement: "project-movement",
      locationTransfer: "location-transfer",
      shortTrip: "short-trip",
      inactivate: "inactivate",
      reactivate: "reactivate",
      terminate: "terminate",
      reports: "reports",
      generateActivity: "generate-activity",
      appUser: "app-user",
      managerDetails: "manager-details"
    },
    LOGGER_ACTION: {
      create: "create",
      update: "update",
      delete: "delete",
      statusUpdate: "status-update",
      generateActivity: "generate-activity",
      sendToActivity: "send-to-generate-activity",
    },
    genderOptions: [
      {
        value: "Male",
        label: "Male"
      },
      {
        value: "Female",
        label: "Female"
      },
      {
        label: "Other",
        value: "Other"
      }
    ],
    transferTypeOptions: [
      {
        label:"ONSITE-OFFSITE",
        value:"ONSITE-OFFSITE"
      },
      {
        label:"OFFSITE-ONSITE",
        value:"OFFSITE-ONSITE"
      },
      {
        label:"OFF-NEAR",
        value:"OFF-NEAR"
      },
      {
        label:"NEAR-OFF",
        value:"NEAR-OFF"
      },
      {
        label:"NEAR-ON",
        value:"NEAR-ON"
      },
      {
        label:"ON-NEAR",
        value:"ON-NEAR"
      }
    ],
    GENERATEACTIVE:{
      USERACTIVE:"user",
      NETWORKSETUPACTIVE:"network-setup",
      NEWHIREACTIVE:"hire",
      LOCATIONTRANSFERACTIVE:"location-transfer",
      SHORTTRIPACTIVE:"short-trip",
      PROJECTMOVEMENTACTIVE:"project-movement",
      TERMINATEDACTIVE:"terminate",
      INACTIVEACT:"inactivate",
      REACTIVEACT:"reactivate"
    },
    FIELD_MAPPINGS: {
      hclSapNo: "HCL SAP NO",
      igtReportingManager: "IGT REPORTING MANAGER",
      hclManager: "HCL MANAGER",
      managerHclSapNo: "HCL MANAGER SAP NO",
      hclBookingManager: "HCL BOOKING MANAGER",
      hclManagerSapID: "HCL MANAGER SAP NO",
      hclManager: "HCL MANAGER",
      projectManagerName: "PROJECT MANAGER NAME",
      projectName: "PROJECT NAME",
      activityInitiatedDate: "ACTIVITY INITIATED DATE",
      activityInitiatedModule: "ACTIVITY INITIATED MODULE",
      activityRecordId: "ACTIVITY RECORD ID",
      createdBy: "CREATED BY",
      createdAt: "CREATED AT",
      name: "NAME",
      location: "LOCATION",
      subLocation: "SUB LOCATION",
      gender: "GENDER",
      designation: "DESIGNATION",
      employeeSubGroup: "EMPLOYEE SUB GROUP",
      dojOfHCL: "DOJ OF HCL",
      dojOfIGT: "DOJ OF IGT",
      hclEmail: "HCL EMAIL",
      hclReportingManagerSapNo: "HCL REPORTING MANAGER SAP NO",
      hclReportingManager: "HCL REPORTING MANAGER",
      hclBookingManager: "HCL BOOKING MANAGER",
      igtTimeApprover1: "IGT TIME APPROVER 1",
      igtTimeApprover2: "IGT TIME APPROVER 2",
      igtProjectManager: "IGT PROJECT MANAGER",
      primaryRole: "PRIMARY ROLE",
      projectToCharge: "PROJECT TO CHARGE",
      effectiveDate: "EFFECTIVE START DATE",
      effectiveEndDate: "EFFECTIVE END DATE",
      igtEmailId: "IGT EMAIL ID",
      igtId: "IGT ID",
      igtUserId: "IGT USER ID",
      organizationName: "ORGANIZATION NAME",
      transferType: "TRANSFER TYPE",
      tripLocation: "TRIP LOCATION",
      tripStartDate: "TRIP START DATE",
      tripEndDate: "TRIP END DATE",
      startDateofTravel: "START DATE OF TRAVEL",
      expectedReturnDate: "EXPECTED RETURN DATE",
      requestedBy: "REQUESTED BY",
      expEndDate: "EXPIRATION END DATE",
      newIgtProjectManager: "NEW IGT PROJECT MANAGER",
      newProject: "NEW PROJECT",
      lastClarityEntryDate: "LAST CLARITY ENTRY DATE",
      effectiveInactiveDate: "EFFECTIVE INACTIVE DATE",
      effectiveTerminateEndDate: "EFFECTIVE TERMINATE END DATE",
      status: "STATUS",
      approval: "APPROVAL",
      comments: "COMMENTS",
      document: "DOCUMENT",
      isTerminated: "USER STATUS"
    }
  };