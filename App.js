import React, { useEffect, useState, useContext } from "react";
import Navbar from "./components/navbar/Navbar";
import ProjectTable from "./components/table/Table";
import ProgressBar from "./components/progressBar/ProgressBar";
import Aside from "./components/aside/Aside";
import CardContainer from "./components/cardContainer/CardContainer";
import { DarkModeContext } from "./context/context";
import { ActiveProjectContext } from "./context/activeProject";
import { UserContext } from "./context/user";
import { ProductivityContext } from "./context/productivity";
import "./dark.css";
import Loader from "./components/loader/Loader";
import ReactBigCalendar from "./components/calendar/Calendar";
import AsideCalendar from "./components/calendar/aside/AsideCalendar";
import { EventsContext } from "./context/events";
import { loaderCircle } from "./components/loader/loaderCircle/loaderCircle";
import CollapsibleTable from "./components/testingtasksTable/testingtaskTable";
import {TasksContext} from "./context/tasks";
import AdhocTable from "./components/adhocTasks/adhoc";
import { Padding } from "@mui/icons-material";

const zohoinit = ZOHO.CREATOR.init(),
  zohoutil = ZOHO.CREATOR.UTIL,
  zohoapi = ZOHO.CREATOR.API;

const App = () => {
  const [darkMode] = useContext(DarkModeContext);
  const [activePrj, setActivePrj] = useContext(ActiveProjectContext);
  const [events, setEvents] = useContext(EventsContext);
  const [productivity, setProductivity] = useContext(ProductivityContext);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useContext(UserContext);
  const [tasks, setTasks] = useContext(TasksContext);
  const [selectedNavItem, setSelectedNavItem] = useState("default");

  function convertDateStringToDateTime(dateString) {
    // Split the input string into daet and time parts
    const [datePart, timePart] = dateString.split(" ");

    // Map month abbreviations to month numbers
    const monthAbbreviations = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    // Parse the date
    const [day, monthAbbrev, year] = datePart.split("-");
    const month = monthAbbreviations[monthAbbrev];
    const parsedDate = new Date(year, month, day);

    // Parse the time
    const [hours, minutes, seconds] = timePart.split(":");
    parsedDate.setHours(hours, minutes, seconds || 0);

    return parsedDate;
  }

  useEffect(() => {
    async function fetchData() {
      try {
        await zohoinit;
        let initparams = await zohoutil.getInitParams();
        if (selectedNavItem === "default") {
          let formData = { data: { Email: "" + initparams.loginUser + "" ,Metadata:"Default"} };
          let config = { formName: "Sid_Dashboard_Response", data: formData };
          let response = await zohoapi.addRecord(config);
          const id = response.data.ID;
          let config_ags = {
            reportName: "All_Sid_Dashboard_Responses",
            id: `${id}`,
            fieldName: "File_upload",
          };
          let data = await zohoapi.readFile(config_ags);
          setData(data);
          setActivePrj(data.activetask);
          setProductivity(data.productivity);
          setUser(data.user);
        } else if (selectedNavItem === "calendar") {
            let formData = { data: { Email: "" + initparams.loginUser + "" ,Metadata:"Events"} };
            let config = { formName: "Sid_Dashboard_Response", data: formData };
            let response = await zohoapi.addRecord(config);
            const id = response.data.ID;
          let events_config = {
            reportName: "All_Sid_Dashboard_Responses",
            id: `${id}`,
            fieldName: "Calendar_Events",
          };
          let eventsResponse = await zohoapi.readFile(events_config);
          const formattedEvents = eventsResponse.events.map((event) => ({
            // Copy other properties from the original event
            ...event,
            // Format start and end dates using the convertDateStringToDateTime function
            start: convertDateStringToDateTime(event.start),
            end: convertDateStringToDateTime(event.end),
          }));
          setEvents(formattedEvents);
        }
        else if (selectedNavItem === "taskTable") {
            let tasks_config = {
                reportName: "My_Task_List",
                criteria : `((Task_Status == "Completed" && Task_Type not in ["Feasibility Check","Scope Assistance"] && PM_Testing_Status != null) || (Task_Type == "Adhoc / Internal Task"))`,
                page : 1,
                pageSize : 10
              };

              let tasksResponse = await zohoapi.getAllRecords(tasks_config);
              setTasks(tasksResponse.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [selectedNavItem]);

  const handleNavbarItemClick = (item) => {
    setSelectedNavItem(item);
    setIsLoading(true);
  };

  return (
    <>
      {isLoading ? (
        <>
          <Navbar />
          <Loader />
        </>
      ) : (
        <div className={darkMode ? "app dark" : "app"}>
          <Navbar selectedNavItem={selectedNavItem} setSelectedNavItem={handleNavbarItemClick}/>
          <div className="outerContainer">
            <section
              className={`container ${
                selectedNavItem === "default"
                  ? "page1"
                  : selectedNavItem === "calendar"
                  ? "page2"
                  : "page3"
              }`}
            >
              {selectedNavItem === "default" && (
                <CardContainer cards={data.cards} />
              )}
              {selectedNavItem === "default" && (
                <ProjectTable data={data.rows} />
              )}
              {selectedNavItem === "calendar" && <ReactBigCalendar />}
                    {selectedNavItem === "taskTable" && <CollapsibleTable />}
                    {selectedNavItem === "taskTable" && <AdhocTable/>}
            </section>
            {(selectedNavItem === "default" || selectedNavItem === "taskTable") && (
              <Aside />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default App;
