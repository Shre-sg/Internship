import React, { useState, useEffect } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import 'bootswatch/dist/lux/bootstrap.min.css';
import axios from 'axios';
import CONFIG from '../config'; // Assuming CONFIG.BACKEND_URL is defined
import AutoDismissAlert from '../components/AutoDismissAlert'; // Import the utility component
import { showAlert } from '../utils/alertUtils'; // Ensure this utility is implemented

const Attendance = () => {
  const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [monthSummary, setMonthSummary] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceRecorded, setAttendanceRecorded] = useState(false);
  const [isHoliday, setIsHoliday] = useState(false);
  const [canEditAttendance, setCanEditAttendance] = useState(false); // Initially not editable
  const [isEditMode, setIsEditMode] = useState(false); // Track whether we're in edit mode


  // Fetch all employees
  useEffect(() => {
    axios
      .get(`${CONFIG.BACKEND_URL}/attendance`)
      .then((response) => {
        const employees = response.data.employees || [];
        setEmployees(employees);

        // Initialize attendanceData with default status for all employees
        const initialAttendance = employees.reduce((acc, employee) => {
          acc[employee.employee_id] = 'Absent'; // Set default status here
          return acc;
        }, {});
        setAttendanceData(initialAttendance);

        setAttendanceRecorded(response.data.attendanceRecorded || false);
      })
      .catch((error) => {
        console.error('Error fetching employees:', error);
        showAlert('Error fetching employee data.', 'danger');
      });
  }, []);

  // Fetch attendance for the selected date
  useEffect(() => {
    if (selectedDate) {
      axios
        .get(`${CONFIG.BACKEND_URL}/attendance/${selectedDate}`)
        .then((response) => {
          const { attendance, monthSummary } = response.data;
          const updatedAttendanceData = attendance.reduce((acc, record) => {
            acc[record.employee_id] = record.status;
            return acc;
          }, {});
          setAttendanceData(updatedAttendanceData);
          setMonthSummary(monthSummary || {});
        })
        .catch((error) => {
          console.error('Error fetching attendance:', error);
          showAlert('Failed to fetch attendance for the selected date.', 'danger');
        });
    }
  }, [selectedDate]);

  // Handle attendance change (present, absent, holiday)
  const handleAttendanceChange = (employeeId, status) => {
    setAttendanceData((prevData) => ({
      ...prevData,
      [employeeId]: status,
    }));
  };

  const isAttendanceComplete = () => {
    return employees.every((employee) => attendanceData[employee.employee_id]);
  };

  const handleSubmitAttendance = () => {
    const payload = {
      attendance: Object.entries(attendanceData).map(([employeeId, status]) => ({
        employee_id: parseInt(employeeId, 10),
        status,
      })),
    };

    axios
      .post(`${CONFIG.BACKEND_URL}/attendance`, payload)
      .then(() => {
        setAttendanceRecorded(true);
        setAttendanceData({});
      })
      .catch((error) => {
        const errorMsg =
          error.response?.data?.message || 'Error submitting attendance.';
        console.error(errorMsg, error);
        showAlert(errorMsg, 'danger');
      });
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.employee_id.toString().includes(searchQuery) ||
      employee.name.toLowerCase().includes(searchQuery)
  );

  const handleHolidayChange = () => {
    setIsHoliday(!isHoliday);
    const holidayAttendance = employees.reduce((acc, employee) => {
      acc[employee.employee_id] = isHoliday ? 'Absent' : 'Holiday'; // Toggle between Holiday and Absent
      return acc;
    }, {});
    setAttendanceData(holidayAttendance);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode); // Toggle the edit mode
    if (!isEditMode) {
      // When switching to edit mode, you may want to set all attendance as 'Absent' by default
      const editableAttendance = employees.reduce((acc, employee) => {
        acc[employee.employee_id] = attendanceData[employee.employee_id] || 'Absent';
        return acc;
      }, {});
      setAttendanceData(editableAttendance);
    }
  };

  return (
    <div className="container mt-4 zindex-1">
      <h1 className="text-center mb-4">Attendance Management</h1>
      
      {/* Attendance recorded message */}
      {attendanceRecorded && (
        <AutoDismissAlert
          variant="success"
          message={`Attendance for ${selectedDate} has already been recorded.`}
          duration={3000}
        />
      )}

      <Form.Control
        type="text"
        placeholder="Search by Employee ID or Name"
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ width: '300px', marginBottom: '20px' }}
      />

      <div className="d-flex justify-content-between mb-4">
        <Button
          variant="primary"
          onClick={handleSubmitAttendance}
          disabled={isEditMode ? false : !isAttendanceComplete()}
        >
          {isEditMode ? 'Update Attendance' : 'Submit Attendance'}
        </Button>
        <Form.Check
          type="checkbox"
          checked={isHoliday}
          onChange={handleHolidayChange}
          label="Today is Holiday"
        />
        
        {/* Datepicker for attendance date */}
        <Form.Control
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          style={{ width: '200px' }}
        />

        <Button
          variant="secondary"
          onClick={toggleEditMode}
          className="ml-2"
        >
          {isEditMode ? 'Cancel Edit' : 'Edit Attendance'}
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Attendance</th>
            <th>Month Summary</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee.employee_id}>
              <td>{employee.employee_id}</td>
              <td>{employee.name}</td>
              <td>
                {['Present', 'Absent','Half Day', 'Holiday'].map((status) => (
                  <Form.Check
                    type="radio"
                    label={status}
                    name={`attendance-${employee.employee_id}`}
                    value={status}
                    checked={attendanceData[employee.employee_id] === status}
                    onChange={() =>
                      handleAttendanceChange(employee.employee_id, status)
                    }
                    key={status}
                    disabled={!canEditAttendance} // Disable editing if attendance can't be edited
                  />
                ))}
              </td>
              <td>
                {monthSummary[employee.employee_id] ? (
                  <>
                    <div>Present: {monthSummary[employee.employee_id].present}</div>
                    <div>Absent: {monthSummary[employee.employee_id].absent}</div>
                    <div>Half Day: {monthSummary[employee.employee_id].halfDay}</div>
                    <div>Holiday: {monthSummary[employee.employee_id].holidays}</div>
                  </>
                ) : (
                  <span>No data available</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Attendance;
