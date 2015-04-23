/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {
    var model = {
        students: [
            {
                name: "Slappy the Frog",
                days: []
            },
            {
                name: "Lilly the Lizard",
                days: []
            },
            {
                name: "Paulrus the Walrus",
                days: []
            },
            {
                name: "Gregory the Goat",
                days: []
            },
            {
                name: "Adam the Anaconda",
                days: []
            }
        ],
        days: 12,
        loadData: function() {
            var that = this;
            var attendance = JSON.parse(localStorage.attendance);
            $.each(attendance, function() {
                var saved = this;
                $.each(that.students, function() {
                    if (this.name == saved.name) {
                        this.days = saved.days;
                        return false; //exit inner loop
                    }
                });
            });
        }
    }

    var optopus = {
        init: function() {
            model.loadData();
            attendanceGridView.init();
        },
        getDays: function() {
            return model.days;
        },
        getStudents: function() {
            return model.students;
        },
        setAttendance: function(student, $row) {
            var name = student.name,
                $allCheckboxes = $row.find('input');

            student.days = [];

            $allCheckboxes.each(function() {
                student.days.push($(this).prop('checked'));
            });
            localStorage.attendance = JSON.stringify(model.students);
            return student;
        }
    }
    var attendanceGridView = {
        init: function() {
            this.grid = $("#attendanceGrid");
            this.head = $("thead > tr", this.grid);
            this.body = $("tbody", this.grid);
            this.render();
        },
        render: function() {
            // draw the columns (days)
            this.head.append("<th class='name-col'>Student Name</th>");
            var i=1, days=optopus.getDays();
            for (i=1; i<=days; i++) {
                this.head.append("<th>"+i+"</th>");
            }
            this.head.append("<th class='missed-col'>Days Missed-col</th>");

            // draw the rows (students)
            var students = optopus.getStudents();
            var view = this;
            $.each(students, function() {
                var student = this;
                var $row = $("<tr></tr>");
                $row.append("<td>"+student.name+"</td>");
                for (i=1; i<=days; i++) {
                    var $inp = $("<td><input data-day='"+i+"' type='checkbox' /></td>")
                    $inp.find("input").prop('checked', student.days[i-1]);
                    $row.append($inp);
                }
                $row.append("<td class='missed-col'></td>");
                $row.find("input[type='checkbox']").click(function(event) {
                    var std = optopus.setAttendance(student,$(event.target).closest("tr"));
                    view.countMissing(std, $(event.target).closest("tr"));
                });
                view.body.append($row);
                var std = optopus.setAttendance(student, $row);
                view.countMissing(std, $row);
            });
        },
        // Count a student's missed days
        countMissing: function (student, $row) {
            var numMissed = 0;
            $.each(student.days, function() {
                if (this == false) {
                    numMissed++;
                }
            });
            $row.find(".missed-col").text(numMissed);
        }
    }
    
    optopus.init();
}());
