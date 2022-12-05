import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { ProfilePhoto } from "../../components/User";
import { StaffStatusBadge } from "../../components/Staff";
import Table, {
  Pagination,
  TBody,
  THead,
  TRow,
  usePagination,
} from "../../components/Table";
import { StaffLayout, Header, Main } from "../../components/Layout";
import { selectStaffs, selectStaffsUpdateTime } from "../../redux/staffs";
import { useAppSelector } from "../../redux/store";
import useAuth from "../../contexts/auth";
import { Staff } from "../../types/staff";

// P - Staffs' List
function StaffList() {
  // [States]
  const staffs = useAppSelector(selectStaffs);
  const updateTime = useAppSelector(selectStaffsUpdateTime);

  // [Hooks]
  const { isAdmin } = useAuth();

  // [Pagination]
  const { currentPage, setPage, currentItems, itemsPerPage } =
    usePagination<Staff>(staffs);

  return (
    <StaffLayout
      title="Staffs' List"
      select="Staffs"
      isLoading={updateTime === "Updating..."}
    >
      <Main>
        <Header
          hideBack
          title={`Staffs' List (${staffs.length})`}
          subTitle={`Updated on: ${updateTime}`}
          btns={
            isAdmin && (
              <Link to="/staff/add">
                <PlusCircleIcon className="w-10 h-10 p-1  hover:bg-gray-300 rounded-md" />
              </Link>
            )
          }
        />

        <Table
          pagination={
            <Pagination
              currentPage={currentPage}
              setPage={setPage}
              itemsPerPage={itemsPerPage}
              totalItems={staffs.length}
            />
          }
        >
          <THead
            columns={[
              "Photo",
              "Status",
              "Name",
              "Phone Number",
              "Role",
              "Actions",
            ]}
          />
          <TBody>
            {currentItems.map((staff, i) => (
              <TRow
                key={i}
                data={[
                  <ProfilePhoto size="sm" src={staff.photoUrl} />,
                  <StaffStatusBadge disabled={staff.disabled} />,
                  staff.displayName,
                  staff.phone_number,
                  staff.role,
                  <Link to={`/staff/${staff.email}`}>
                    <PencilSquareIcon className="text-black w-8 h-8 p-1 rounded-md hover:bg-gray-300 hover:cursor-pointer" />
                  </Link>,
                ]}
                center
              />
            ))}
          </TBody>
        </Table>
      </Main>
    </StaffLayout>
  );
}

export default StaffList;
