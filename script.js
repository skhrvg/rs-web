var groups;
$.ajax({
  type: "GET",
  url: "https://rs.skhrvg.xyz/api/groups/",
  async: false,
  success: function (data) {
    groups = data;
  },
});
currentGroupName = Cookies.get("group");
var group;
var date = new Date();
$.ajax({
  type: "GET",
  url: "https://rs.skhrvg.xyz/api/groups/" + currentGroupName,
  async: false,
  success: function (data) {
    group = data;
  },
});
try {
  for (i = 0; i < group.classes.length; i++) {
    group.classes[i].date = new Date(group.classes[i].date);
  }
} catch (e) {
  console.log(e);
}

// -------------------- SETTINGS -------------------------

function getGroups() {
  $("button#saveSettings").addClass("disabled");
  if (
    $(".ui.dropdown.selectInstitute").dropdown("get value") != "" &&
    $(".ui.dropdown.selectStudyLevel").dropdown("get value") != ""
  ) {
    groupsSelect = [];
    for (i = 0; i < groups.length; i++) {
      if (
        groups[i].institute ==
          $(".ui.dropdown.selectInstitute").dropdown("get value") &&
        groups[i].studyLevel ==
          $(".ui.dropdown.selectStudyLevel").dropdown("get value")
      ) {
        groupsSelect.push({
          value: groups[i].groupName,
          text: groups[i].groupName,
          name: groups[i].groupName,
        });
      }
    }
    if (groupsSelect.length > 0) {
      $(".ui.dropdown.selectGroup").dropdown(
        "set placeholder text",
        "Выберите..."
      );
      $(".ui.dropdown.selectGroup").dropdown("setup menu", {
        values: groupsSelect,
      });
    } else {
      $(".ui.dropdown.selectGroup").dropdown("setup menu", {
        values: [],
      });
      $(".ui.dropdown.selectGroup").dropdown("restore placeholder text");
      $("button#saveSettings").addClass("disabled");
    }
  } else {
    $(".ui.dropdown.selectGroup").dropdown("setup menu", {
      values: [],
    });
    $(".ui.dropdown.selectGroup").dropdown("restore placeholder text");
    $("button#saveSettings").addClass("disabled");
  }
}

function checkGroup() {
  if ($(".ui.dropdown.selectGroup").dropdown("get value") != "") {
    $("button#saveSettings").removeClass("disabled");
  } else {
    $("button#saveSettings").addClass("disabled");
  }
}

function saveSettings() {
  Cookies.set("group", $(".ui.dropdown.selectGroup").dropdown("get text"), {
    expires: 30,
  });
  document.location.reload(false);
}

function openSettings() {
  $("#settings")
    .modal("setting", "closable", false)
    .modal("setting", "autofocus", false)
    .modal("show");
  try {
    $(".ui.dropdown.selectStudyLevel").dropdown(
      "set selected",
      group.studyLevel
    );
    $(".ui.dropdown.selectInstitute").dropdown("set selected", group.institute);
    $(".ui.dropdown.selectGroup").dropdown("set selected", group.groupName);
  } catch (e) {
    console.log(e);
  }
}

// ------------------------- CALENDAR -------------------------

function getClasses() {
  date = $("#standard_calendar").calendar("get date");
  $("#classes").html("");
  for (i = 0; i < group.classes.length; i++) {
    if (
      group.classes[i].date.getFullYear() == date.getFullYear() &&
      group.classes[i].date.getMonth() == date.getMonth() &&
      group.classes[i].date.getDate() == date.getDate()
    ) {
      html = "";
      html += `
        <div class="ui noshadow segment class">
        <h2 class="ui sub header classTime">${group.classes[i].time}</h2>
        <h4 class="ui header classDiscipline">${group.classes[i].discipline}</h4>
        <p class="classType">${group.classes[i].classType}</p>`;
      if (group.classes[i].location != "" || group.classes[i].comment != "") {
        html += `<p class="classInfo">`;
        if (group.classes[i].location != "") {
          html += `<span class="classLocation">${group.classes[i].location}</span>`;
        }
        if (group.classes[i].comment != "") {
          html += `<span class="classComment">${group.classes[i].comment}</span>`;
        }
        html += `</p>`;
      }
      html += `
        <p class="classProfessor">${group.classes[i].professor}</p>
        </div>`;
      $("#classes").append(html);
    }
  }
  if ($("#classes").html() == "") {
    $("#classes").html(`
        <div class="ui placeholder segment dayoff">
        <div class="ui icon header">
        <i class="check icon"></i>
        Выходной!
        </div>
        </div>
      `);
  }
}

function goForward() {
  date.setDate(date.getDate() + 1);
  $("#standard_calendar").calendar(
    "set date",
    date,
    (updateInput = true),
    (fireChange = true)
  );
}

function goBack() {
  date.setDate(date.getDate() - 1);
  $("#standard_calendar").calendar(
    "set date",
    date,
    (updateInput = true),
    (fireChange = true)
  );
}
