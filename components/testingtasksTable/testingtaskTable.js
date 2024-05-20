import React, { useState,useContext } from "react";
import PropTypes from 'prop-types';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination'; // Import TablePagination
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {TasksContext} from "../../context/tasks";

import "./testingtaskTable.css";
import { borderRadius } from "@mui/system";

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return { backgroundColor: '#fcddb1', color: '#a06d2b' };
    case 'Completed':
      return { backgroundColor: '#fff4d7', color: '#a18034' };
    case 'In Progress':
      return { backgroundColor: '#e3ecfb', color: '#2260ca' };
    default:
      return { color: '#000000' };
  }
};

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.Task_Number}
        </TableCell>
        <TableCell align="center">{row.Project.display_value}</TableCell>
        <TableCell align="center">{row.Task_Type}</TableCell>
        <TableCell align="center" sx={{ '&': { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "300px", maxWidth: "300px" } }}>{row.Task_Description.trim().substring(0,750)</TableCell>
        <TableCell align="center"><div className="pill" style={getStatusColor(row.PM_Testing_Status)}>{row.PM_Testing_Status}</div></TableCell>
        <TableCell align="center">
          <div className='actionContainer'>
            <div className='control'>
            <svg
                  onClick={() => {
                    startTask(
                      param.data.filter((data) => data.id === params.row.id)
                    );
                  }}
                  className="startSvg feather feather-play-circle"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#206db3"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
            </div>
          </div>
        </TableCell>
      </TableRow>
      <TableRow style={{backgroundColor:"#f5f8fa"}}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
                <div className='details'>
                <div className='description' dangerouslySetInnerHTML={{ __html: row.Task_Description }} />
                </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    taskNo: PropTypes.number.isRequired,
    prj: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    overview: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};



const CollapsibleTable = () => {
  const [filter, setFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tasks, setTasks] = useContext(TasksContext);



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddNew = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const toggleStatus = (status) => {
    setFilter(status);
  };


  let testingTasks = tasks.filter(tasks => tasks.Task_Type != "Adhoc / Internal Task");

  const statusCounts = {
    All: testingTasks.length,
    Pending: testingTasks.filter((task) => task.PM_Testing_Status === 'Pending').length,
    'In Progress': testingTasks.filter((task) => task.PM_Testing_Status === 'In Progress').length,
    Completed: testingTasks.filter((task) => task.PM_Testing_Status === 'Completed').length,
  };

  const filteredRows = (filter != "All"? testingTasks
    .filter((row) => row.PM_Testing_Status === filter):testingTasks)
    .filter(
      (row) =>
        row.Project.display_value.toLowerCase().includes(searchText) ||
        row.Task_Type.toLowerCase().includes(searchText) ||
        row.Task_Description.toLowerCase().includes(searchText) ||
        row.PM_Testing_Status.toLowerCase().includes(searchText)
    );

  const sortedRows = filteredRows.sort((a, b) => a.taskNo - b.taskNo);

  const currentRows = sortedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  return (
    <div className="tableContainer">
      <h1>Testing Tasks</h1>
      <div className="tableFunctions">
        <ul className="left">
        <li
            className={`filters ${filter === "All" ? "active" : ""}`}
            onClick={() => toggleStatus("All")}
          >
            All <div className="badge">{statusCounts.All}</div>
          </li>
          <li
            className={`filters ${filter === "Pending" ? "active" : ""}`}
            onClick={() => toggleStatus("Pending")}
          >
            Pending <div className="badge">{statusCounts.Pending}</div>
          </li>
          <li
            className={`filters ${filter === "In Progress" ? "active" : ""}`}
            onClick={() => toggleStatus("In Progress")}
          >
            In Progress <div className="badge">{statusCounts["In Progress"]}</div>
          </li>
          <li
            className={`filters ${filter === "Completed" ? "active" : ""}`}
            onClick={() => toggleStatus("Completed")}
          >
            Completed <div className="badge">{statusCounts.Completed}</div>
          </li>
        </ul>
        <div className="right search">
          <svg
            width="22"
            height="22"
            viewBox="0 0 19 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.50002 14.5C9.28795 14.5 10.0682 14.3448 10.7961 14.0433C11.5241 13.7417 12.1855 13.2998 12.7427 12.7426C13.2998 12.1855 13.7418 11.5241 14.0433 10.7961C14.3448 10.0681 14.5 9.28793 14.5 8.5C14.5 7.71207 14.3448 6.93185 14.0433 6.2039C13.7418 5.47595 13.2998 4.81451 12.7427 4.25736C12.1855 3.70021 11.5241 3.25825 10.7961 2.95672C10.0682 2.65519 9.28795 2.5 8.50002 2.5C6.90872 2.5 5.38259 3.13214 4.25737 4.25736C3.13216 5.38258 2.50002 6.9087 2.50002 8.5C2.50002 10.0913 3.13216 11.6174 4.25737 12.7426C5.38259 13.8679 6.90872 14.5 8.50002 14.5ZM14.82 13.406L18.4 16.986C18.4955 17.0783 18.5716 17.1887 18.6239 17.3108C18.6762 17.4328 18.7037 17.564 18.7048 17.6968C18.7058 17.8296 18.6804 17.9613 18.63 18.0841C18.5797 18.207 18.5053 18.3186 18.4114 18.4124C18.3174 18.5062 18.2057 18.5804 18.0828 18.6306C17.9599 18.6808 17.8282 18.706 17.6954 18.7047C17.5626 18.7035 17.4314 18.6758 17.3095 18.6233C17.1875 18.5708 17.0772 18.4946 16.985 18.399L13.405 14.819C11.7975 16.0668 9.77481 16.6552 7.74877 16.4642C5.72273 16.2732 3.84562 15.3173 2.49957 13.7911C1.15351 12.2648 0.4397 10.2829 0.503441 8.24892C0.567182 6.2149 1.40368 4.28162 2.84266 2.84265C4.28164 1.40367 6.21492 0.567167 8.24894 0.503426C10.283 0.439685 12.2648 1.1535 13.7911 2.49955C15.3173 3.84561 16.2732 5.72271 16.4642 7.74875C16.6552 9.77479 16.0669 11.7975 14.819 13.405L14.82 13.406Z"
              fill="#697077"
            />
          </svg>

          <input
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value.toLowerCase())}
          />
        </div>
      </div>
      <div className="hr"></div>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow className='title'>
              <TableCell />
              <TableCell>Task No.</TableCell>
              <TableCell align="center">Project</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Task Overview</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((row) => (
              <Row key={row.taskNo} row={row} />
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};

export default CollapsibleTable;

