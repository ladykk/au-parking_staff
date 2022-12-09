import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { ProfilePhoto } from "../../components/User";
import Table, {
  Pagination,
  TBody,
  THead,
  TRow,
  TSpan,
  usePagination,
} from "../../components/Table";
import { StaffLayout, Header, Main } from "../../components/Layout";
import {
  selectCustomers,
  selectCustomersUpdateTime,
} from "../../redux/customers";
import { useAppSelector } from "../../redux/store";
import { CustomerWithRef } from "../../types/customer";

// P - Customers' list
function CustomerList() {
  // [States]
  const customers = useAppSelector(selectCustomers);
  const updateTime = useAppSelector(selectCustomersUpdateTime);

  // [Pagination]
  const { currentPage, setPage, currentItems, itemsPerPage } =
    usePagination<CustomerWithRef>(customers);

  return (
    <StaffLayout
      title="Customers' List"
      select="Customers"
      isLoading={updateTime === "Updating..."}
    >
      <Main>
        <Header
          hideBack
          title={`Customers' List (${customers.length})`}
          subTitle={`Updated on: ${updateTime}`}
        />

        <Table
          pagination={
            <Pagination
              currentPage={currentPage}
              setPage={setPage}
              itemsPerPage={itemsPerPage}
              totalItems={customers.length}
            />
          }
        >
          <THead columns={["Photo", "Name", "UID", "Actions"]} />
          <TBody>
            {customers.length > 0 ? (
              currentItems.map((customer, i) => (
                <TRow
                  key={i}
                  data={[
                    <ProfilePhoto
                      src={customer.photoUrl}
                      size="sm"
                      lineThumbnail
                    />,
                    customer.displayName,
                    customer.uid,

                    <Link to={`/customer/${customer.uid}`}>
                      <PencilSquareIcon className="text-black w-8 h-8 p-1 rounded-md hover:bg-gray-300 hover:cursor-pointer" />
                    </Link>,
                  ]}
                  center
                />
              ))
            ) : (
              <TSpan colSpan={4}>No customers in the system.</TSpan>
            )}
          </TBody>
        </Table>
      </Main>
    </StaffLayout>
  );
}

export default CustomerList;
