import styled from "styled-components";

import avatarWoman from "../assets/woman.avif";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchStudents } from "../services/schoolStudents";
import Spinner from "../ui/Spinner";
import PropTypes from "prop-types";
import SpinnerMini from "../ui/SpinnerMini";

import {
  ChangeStudentPortalAccess,
  grantAllAccess,
} from "../services/teachersService";

import Pagination from "../ui/Pagination";
import { useLocation } from "react-router-dom";
import ChooseClass from "../ui/ChooseClass";
import UserListHeader from "../ui/UserListHeader";

const PageHeader = styled.h3`
  margin: 1rem;
`;
const StyledManageAccess = styled.div`
  padding: 2rem;
  height: calc(100vh - 58px);
  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

const StudentContainer = styled.div`
  width: inherit;
  height: calc(100vh - 250px);
  overflow: hidden;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0; /* Remove scrollbar space */
    background: transparent; /* Optional: Just make scrollbar invisible */
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none; /* For Firefox */
`;

const StudentListHeader = styled.ul`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  text-align: center;
  align-items: center;
  background-color: var(--color-gray-400);
  padding: 0.5rem;
  font-weight: 700;
  color: var(--color-gray-200);
  border-radius: 8px;
  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    & > li:nth-child(2) {
      // Hides Username
      display: none;
    }
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr 1fr;
    & > li:nth-child(3) {
      // Hides Gender
      display: none;
    }
  }

  @media (max-width: 470px) {
    grid-template-columns: 1fr 1fr;
    & > li:nth-child(4) {
      // Hides Section
      display: none;
    }
  }
`;

const StyledStudentList = styled.ul`
  position: relative;
  top: 0.5rem;
  min-height: inherit;
`;

const StyledStudent = styled.li`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  text-align: center;
  align-items: center;
  background-color: var(--color-gray-300);
  padding: 0.5rem;
  margin: 1.5rem;
  border-radius: 8px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    & > li:nth-child(2) {
      // Hides Username
      display: none;
    }
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr 1fr;
    & > li:nth-child(3) {
      // Hides Gender
      display: none;
    }
    & > li:nth-child(4) {
      // Hides Gender
      position: relative;
      left: -1rem;
    }
    & > li:nth-child(5) {
      // Hides Section
      position: relative;
      left: 2rem;
    }
  }

  @media (max-width: 470px) {
    grid-template-columns: 1fr 1fr;
    & > li:nth-child(4) {
      // Hides Section
      display: none;
    }
  }
`;
const Active = styled.li`
  background-color: lightgreen;
  border-radius: 20px;
  text-align: center;
  color: green;
  font-weight: 700;
  width: 10rem;
  height: 2.5rem;
  position: relative;
  left: 4rem;
`;
const NotActive = styled.li`
  background-color: var(--color-red-200);
  align-items: center;
  border-radius: 20px;
  text-align: center;
  color: red;
  font-weight: 700;
  width: 10rem;
  height: 2.5rem;
  position: relative;
  left: 4rem;
`;

const SwitchContainer = styled.div`
  display: inline-block;
  cursor: pointer;
`;

const Switch = styled.div`
  width: 47px;
  height: 20px;
  background-color: ${(props) => (props.isOn ? "lightgreen" : "#ccc")};
  border-radius: 30px;
  position: relative;
  transition: background-color 0.3s;
`;

const Knob = styled.div`
  width: 26px;
  height: 26px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: -4px;
  left: ${(props) => (props.isOn ? "21px" : "0px")};
  transition: left 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Pag = styled.div`
  margin-top: 2rem;
`;

const ToggleSwitch = ({ std, condition }) => {
  const [isOn, setIsOn] = useState(condition);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsOn(condition);
  }, [condition]);

  const { mutate: changeAccess, isPending: isLoading } = useMutation({
    mutationFn: () => ChangeStudentPortalAccess({ std, condition: isOn }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accesspage"],
      });
    },
    onError: (error) => {
      console.error("Error changing access:", error);
    },
  });

  const handleToggle = () => {
    setIsOn((prevIsOn) => !prevIsOn);
    changeAccess();
  };

  return (
    <SwitchContainer onClick={handleToggle}>
      {isLoading ? (
        <SpinnerMini />
      ) : (
        <Switch isOn={isOn}>
          <Knob isOn={isOn} />
        </Switch>
      )}
    </SwitchContainer>
  );
};

const ManageStudentAccess = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(9); // Set default to 7 rows per page
  const [searchQuery, setSearchQuery] = useState(""); // State to manage search query
  const params = new URLSearchParams(location.search);
  const classStudents = params.get("class");

  const { data, isLoading } = useQuery({
    queryKey: ["accesspage", classStudents],
    queryFn: () => fetchStudents(classStudents),
  });

  const totalItems = data?.length || 0;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search query changes
  };

  // Mutation to grant access to all students in the specified class
  const { mutate: grantAccessMutation, isPending } = useMutation({
    mutationFn: () => grantAllAccess(classStudents),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accesspage", classStudents],
      });
    },
    onError: (error) => {
      console.error("Error granting access:", error);
    },
  });

  const handleGrantAllAccess = () => {
    grantAccessMutation();
  };

  // Sort the data alphabetically by name
  const sortedData = data?.slice().sort((a, b) => a.name.localeCompare(b.name));

  // Filter the data based on the search query
  const filteredData = sortedData?.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic to slice the data based on current page and rowsPerPage
  const paginatedData = filteredData?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  if (isLoading || isPending) return <Spinner size="medium" />;

  if (!classStudents)
    return (
      <StyledManageAccess>
        <PageHeader>Manage Student Access</PageHeader>
        <ChooseClass
          redirectRoute={"managestudentaccess"}
          btnLabel="Manage Access"
        />
      </StyledManageAccess>
    );

  return (
    <StyledManageAccess>
      <div>
        <UserListHeader
          pageDetail="  Manage Student "
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
          submit={handleGrantAllAccess}
          btnDesc="Grant all Access"
        />
        <StudentListHeader>
          <li>Name</li>
          <li>Username</li>
          <li>Class</li>
          <li>Status</li>
          <li>Grant Portal Access</li>
        </StudentListHeader>
        <StudentContainer>
          <p style={{ fontSize: "13px" }}>
            showing {paginatedData?.length} of {totalItems} students
          </p>

          <StyledStudentList>
            {paginatedData?.map((std) => (
              <StyledStudent key={std.id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    minWidth: "20rem",
                    fontSize: "small",
                  }}
                >
                  <img
                    style={{ borderRadius: "50%", width: "4rem" }}
                    src={avatarWoman}
                    alt=""
                  />
                  <li style={{ paddingLeft: "0.4rem" }}>{std.name}</li>
                </div>
                <li
                  style={{
                    textAlign: "left",
                    position: "relative",
                    left: "5rem",
                  }}
                >
                  {std.name.split(" ")[0].toLowerCase()}
                </li>
                <li>{std.class_id}</li>
                {std.hasAccess ? (
                  <Active>Active</Active>
                ) : (
                  <NotActive>Not-Active</NotActive>
                )}
                <li>
                  <ToggleSwitch std={std} condition={std.hasAccess} />
                </li>
              </StyledStudent>
            ))}
          </StyledStudentList>
        </StudentContainer>
        <Pag>
          <Pagination
            totalPages={Math.ceil(filteredData.length / rowsPerPage)}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsChange={handleRowsChange}
          />
        </Pag>
      </div>
    </StyledManageAccess>
  );
};

ToggleSwitch.propTypes = {
  condition: PropTypes.string.isRequired,
  std: PropTypes.string.isRequired,
};

export default ManageStudentAccess;
