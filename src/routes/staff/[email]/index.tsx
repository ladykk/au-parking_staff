import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { Link, useParams } from "react-router-dom";
import { ProfilePhoto } from "../../../components/User";
import { StaffStatusBadge } from "../../../components/Staff";
import Table, { TBody, TPair } from "../../../components/Table";
import { StaffLayout, Header, Main, Panel } from "../../../components/Layout";
import { selectStaffs, selectStaffsUpdateTime } from "../../../redux/staffs";
import { useAppSelector } from "../../../redux/store";
import useAuth from "../../../contexts/auth";
import Feedback from "../../../components/Feedback";

// P - Staff detail.
function StaffDetail() {
  // [States]
  const staffs = useAppSelector(selectStaffs);
  const updateTime = useAppSelector(selectStaffsUpdateTime);

  // [Hooks]
  const { email } = useParams();
  const { user, isAdmin } = useAuth();

  // [Data]
  const staff = staffs.find((staff) => staff.email === email);
  const add_staff = staff?.add_by
    ? staffs.find((s) => s.email === staff.add_by?.id)
    : null;

  return (
    <StaffLayout
      title="Staff's Info"
      select="Staffs"
      isLoading={updateTime === "Updating..."}
    >
      <Main>
        <Header
          title="Staff's Info"
          subTitle={`Updated on: ${updateTime}`}
          btns={
            (isAdmin || user?.email === email) && (
              <Link to={`/staff/${email}/edit`}>
                <PencilSquareIcon className="w-10 h-10 p-1 rounded-md hover:bg-gray-200 hover:cursor-pointer" />
              </Link>
            )
          }
        />

        {updateTime === "Updating..." ? (
          <></>
        ) : !staff ? (
          <Feedback
            header="Staff not found."
            message={`Staff with email "${email}" is not found.`}
            type="Error"
          />
        ) : (
          <div className="flex flex-col gap-2 lg:flex-row lg:gap-5">
            <Panel header="Info">
              <Table>
                <TBody>
                  <TPair
                    header="Photo"
                    value={
                      <div>
                        <div className="block md:hidden">
                          <ProfilePhoto size="md" src={staff.photoUrl} />
                        </div>
                        <div className="hidden md:block">
                          <ProfilePhoto size="lg" src={staff.photoUrl} />
                        </div>
                      </div>
                    }
                  />
                  <TPair
                    header="Status"
                    value={<StaffStatusBadge disabled={staff.disabled} />}
                  />
                  <TPair header="Name" value={staff.displayName} />
                  <TPair header="Email Address" value={staff.email} />
                  <TPair header="Phone Number" value={staff.phone_number} />
                  <TPair header="Role" value={staff.role} />
                </TBody>
              </Table>
            </Panel>
            {add_staff && (
              <Panel header="Add by">
                <Table>
                  <TBody>
                    <TPair
                      header="Photo"
                      value={
                        <div>
                          <div className="block md:hidden">
                            <ProfilePhoto size="md" src={add_staff.photoUrl} />
                          </div>
                          <div className="hidden md:block">
                            <ProfilePhoto size="lg" src={add_staff.photoUrl} />
                          </div>
                        </div>
                      }
                    />
                    <TPair
                      header="Status"
                      value={<StaffStatusBadge disabled={add_staff.disabled} />}
                    />
                    <TPair header="Name" value={add_staff.displayName} />
                    <TPair header="Email Address" value={add_staff.email} />
                    <TPair
                      header="Phone Number"
                      value={add_staff.phone_number}
                    />
                    <TPair header="Role" value={add_staff.role} />
                  </TBody>
                </Table>
              </Panel>
            )}
          </div>
        )}
      </Main>
    </StaffLayout>
  );
}

export default StaffDetail;
