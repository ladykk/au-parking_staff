import { useParams } from "react-router-dom";
import { AddCarModal, CarRemoveModal } from "../../components/Car";

import { ProfilePhoto } from "../../components/User";
import Table, {
  TBody,
  THead,
  TPair,
  TRow,
  TSpan,
} from "../../components/Table";
import { StaffLayout, Header, Main, Panel } from "../../components/Layout";
import Feedback from "../../components/Feedback";
import { useGetCustomerByUID } from "../../helpers/customer";

// P - Customer detail
export function CustomerDetail() {
  // [Hooks]
  const { uid } = useParams();
  const { customer, updateTime } = useGetCustomerByUID(uid as string);

  return (
    <StaffLayout
      title="Customer's Info"
      select="Customers"
      isLoading={updateTime === "Updating..."}
    >
      <Main>
        <Header
          title="Customer's Info"
          subTitle={`Updated on: ${updateTime}`}
        />
        {updateTime === "Updating" ? (
          <></>
        ) : !customer ? (
          <Feedback
            header="Customer not found."
            message={`Customer with uid "${uid}" is not found.`}
            type="Error"
          />
        ) : (
          <>
            <Panel header="Info">
              <Table>
                <TBody>
                  <TPair
                    header="Photo"
                    value={
                      <div>
                        <div className="block md:hidden">
                          <ProfilePhoto
                            src={customer.photoUrl}
                            size="md"
                            lineThumbnail
                          />
                        </div>
                        <div className="hidden md:block">
                          <ProfilePhoto
                            src={customer.photoUrl}
                            size="lg"
                            lineThumbnail
                          />
                        </div>
                      </div>
                    }
                  />
                  <TPair header="UID" value={customer.uid} />
                  <TPair header="Name" value={customer.displayName} />
                </TBody>
              </Table>
            </Panel>
            <Panel
              header="Registered Cars"
              btns={<AddCarModal customer={customer} />}
            >
              <Table>
                <THead
                  columns={[
                    "No.",
                    "License number",
                    "Province",
                    "Brand",
                    "Color",
                    "Actions",
                  ]}
                />
                <TBody>
                  {customer.cars ? (
                    customer.cars.length > 0 ? (
                      customer.cars.map((car, i) => (
                        <TRow
                          key={i}
                          data={[
                            i + 1,
                            car.license_number,
                            car.province,
                            car.brand,
                            car.color,
                            <CarRemoveModal car={car} user="Staff" />,
                          ]}
                          center
                        />
                      ))
                    ) : (
                      <TSpan colSpan={6} center>
                        No registered car.
                      </TSpan>
                    )
                  ) : (
                    <TSpan colSpan={6} center>
                      No registered car.
                    </TSpan>
                  )}
                </TBody>
              </Table>
            </Panel>
          </>
        )}
      </Main>
    </StaffLayout>
  );
}

export default CustomerDetail;
