import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { Bar } from "react-chartjs-2";
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from "chart.js/auto";
import "./TaskAssign.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const getProgressStyle = (progress) => {
  switch (progress) {
    case "Completed":
      return { backgroundColor: "#2E7D32", color: "white", padding: "5px 10px", borderRadius: "5px" };
    case "In Progress":
      return { backgroundColor: "#8D6E63", color: "white", padding: "5px 10px", borderRadius: "5px" };
    case "On Hold":
      return { backgroundColor: "#FDD835", color: "white", padding: "5px 10px", borderRadius: "5px" };
    default:
      return { backgroundColor: "gray", color: "white", padding: "5px 10px", borderRadius: "5px" };
  }
};

const TaskAssign = () => {
  const [taskRoutes, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  // Calculate min and max allowed months (5 months back and 5 months forward)
  const currentDate = new Date();
  const minAllowedDate = new Date();
  minAllowedDate.setMonth(currentDate.getMonth() - 5);
  
  const maxAllowedDate = new Date();
  maxAllowedDate.setMonth(currentDate.getMonth() + 5);

  // Fetching task data
  const fetchTasks = () => {
    axios
      .get("http://localhost:5000/task")
      .then((response) => {
        setTasks(response.data);
      })
      .catch((err) => {
        console.error("Error fetching tasks: ", err);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter tasks by the current month and year
  const filteredTasks = taskRoutes.filter((task) => {
    const taskDate = new Date(task.startDate);
    return (
      taskDate.getMonth() + 1 === currentMonth && taskDate.getFullYear() === currentYear
    );
  });

  // Apply search filter based on employee ID, project ID, location, role, or start date
  const searchFilteredTasks = filteredTasks.filter((task) => {
    const taskDate = new Date(task.startDate).toLocaleDateString();
    return (
      task.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.projectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.projectLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      taskDate.includes(searchQuery)
    );
  });

  // Group tasks by employeeId
  const groupedTasks = searchFilteredTasks.reduce((acc, task) => {
    if (!acc[task.employeeId]) {
      acc[task.employeeId] = [];
    }
    acc[task.employeeId].push(task);
    return acc;
  }, {});

  const startEditing = (task) => {
    navigate(`/update-task/${task._id}`, { state: { task } });
  };

  const deleteEmployee = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Why do you want to delete this Task Assign?',
      icon: 'warning',
      input: 'select',
      inputOptions: {
        'Wrong Task': 'Wrong Task',
        'Other': 'Other'
      },
      inputPlaceholder: 'Select a reason',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      preConfirm: (reason) => {
        if (!reason) {
          Swal.showValidationMessage('You need to select a reason');
        }
        return reason;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/task/delete/${id}`)
          .then(() => {
            Swal.fire('Deleted!', 'Task has been deleted.', 'success');
            fetchTasks(); // Fetch updated task data
          })
          .catch((err) => {
            Swal.fire('Error!', 'Error deleting task.', 'error');
          });
      }
    });
  };

  // Check if previous month button should be disabled
  const isPreviousDisabled = () => {
    const currentViewDate = new Date(currentYear, currentMonth - 1);
    return currentViewDate <= minAllowedDate;
  };

  // Check if next month button should be disabled
  const isNextDisabled = () => {
    const currentViewDate = new Date(currentYear, currentMonth - 1);
    return currentViewDate >= maxAllowedDate;
  };

  // Handle navigation to the previous month
  const handlePreviousMonth = () => {
    if (isPreviousDisabled()) return;
    
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Handle navigation to the next month
  const handleNextMonth = () => {
    if (isNextDisabled()) return;
    
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
  
    // Add Company Logo
    const logoUrl = "./image/logo.jpeg";
    doc.addImage(logoUrl, "PNG", 15, 10, 40, 20);
  
    // Add Header Section
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("Greenscape (Pvt)Ltd", 60, 15);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("No 10 ,New plaza road, Mababe, Sri Lanka", 60, 22);
    doc.text("Phone: +055 2246 761 | Email: infogreenscape@gmail.com", 60, 28);
  
    // Add Report Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Employee Task Assignment", 15, 50);
  
    // Add Date, Month, and Year
    const monthYear = `${new Date(currentYear, currentMonth - 1).toLocaleString("default", { month: "long" })} ${currentYear}`;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 60);
    doc.text(`Month: ${monthYear}`, 15, 67);
  
    // Table Headers
    const tableColumn = ["Employee ID", "Name", "Email", "Role", "Project ID", "Location", "Start date", "Progress"];
  
    // Filtered Work Data
    const tableRows = searchFilteredTasks
      .filter((task) => {
        const taskDate = new Date(task.startDate);
        return taskDate.getMonth() + 1 === currentMonth && taskDate.getFullYear() === currentYear;
      })
      .map((task) => [
        task.employeeId,
        task.ename,
        task.email,
        task.role,
        task.projectId,
        task.projectLocation,
        task.startDate ? new Date(task.startDate).toLocaleDateString() : "N/A",
        task.progress,
      ]);
  
    // Create Table
    autoTable(doc, {
      startY: 75,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { halign: "center", fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
    });
  
    // Signature Section
    doc.text("__________________________", 140, doc.lastAutoTable.finalY + 40);
    doc.text("Authorized Signature", 155, doc.lastAutoTable.finalY + 50);
  
    // Report Generated Date
    const date = new Date().toLocaleDateString();
    doc.text(`Report Generated: ${date}`, 15, doc.lastAutoTable.finalY + 50);
  
    // Save PDF
    doc.save(`Task_Assignments_${monthYear}.pdf`);
  };
   
  // Filter unique tasks by project ID for the chart
  const uniqueTasks = searchFilteredTasks.filter((task, index, self) =>
    index === self.findIndex((t) => t.projectId === task.projectId)
  );

  // Calculate progress stats for the bar chart using unique tasks
  const progressCounts = uniqueTasks.reduce((acc, task) => {
    acc[task.progress] = (acc[task.progress] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: ["Completed", "In Progress", "On Hold"],
    datasets: [
      {
        label: "Task Progress",
        data: [
          progressCounts["Completed"] || 0,
          progressCounts["In Progress"] || 0,
          progressCounts["On Hold"] || 0,
        ],
        backgroundColor: ["#2E7D32", "#8D6E63", "#FDD835"],
        borderColor: ["#2E7D32", "#8D6E63", "#FDD835"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    height: 300,
  };

  return (
    <div className="mt-5 table-container">
      <h2 className="page-header">Task Assign Details</h2>
      <button
        className="btn btn-success mb-4"
        onClick={() => navigate("/assign-task")}
      >
        Assign New Task
      </button>

      {/* Search Filter */}
      <div className="mb-4">
        <input
          type="text"
          className="search-Task"
          placeholder="Search by Employee ID, Project ID, Location, Role, or Start Date"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Month and Year Navigation */}
      <div className="d-flex justify-content-between mb-3">
        <button 
          className="btn btn-secondary" 
          onClick={handlePreviousMonth}
          disabled={isPreviousDisabled()}
        >
          Previous Month
        </button>
        <h4>
          {new Date(currentYear, currentMonth - 1).toLocaleString("default", { month: "long" })} {currentYear}
        </h4>
        <button 
          className="btn btn-secondary" 
          onClick={handleNextMonth}
          disabled={isNextDisabled()}
        >
          Next Month
        </button>
      </div>

      {/* Generate Report Button */}
      <button className="btn-pdf" onClick={generatePDFReport}>
        <FontAwesomeIcon icon={faFilePdf} /> Monthly Generate Report
      </button>

      {/* Filtered Tasks Table */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered mt-4">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Project ID</th>
              <th>Project Location</th>
              <th>Start Date</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedTasks).length > 0 ? (
              Object.keys(groupedTasks).map((employeeId) => {
                const tasks = groupedTasks[employeeId];
                return tasks.map((task, index) => (
                  <tr key={task._id}>
                    {index === 0 && (
                      <>
                        <td rowSpan={tasks.length}>{task.employeeId}</td>
                        <td rowSpan={tasks.length}>{task.ename}</td>
                        <td rowSpan={tasks.length}>{task.email}</td>
                        <td rowSpan={tasks.length}>{task.role}</td>
                      </>
                    )}
                    <td>{task.projectId}</td>
                    <td>{task.projectLocation}</td>
                    <td>{task.startDate.split('T')[0]}</td>
                    <td>
                      <span style={getProgressStyle(task.progress)}>{task.progress}</span>
                    </td>
                    <td>
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="text-primary"
                        onClick={() => startEditing(task)}
                        style={{ cursor: "pointer" }}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-danger ml-2"
                        onClick={() => deleteEmployee(task._id)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                  </tr>
                ));
              })
            ) : (
              <tr>
                <td colSpan="9" className="text-center">No tasks assigned.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default TaskAssign;