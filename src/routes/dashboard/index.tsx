import { StaffLayout, Header, Main, Panel } from "../../components/Layout";

function Dashboard() {
  return (
    <StaffLayout select="Dashboard" title="Dashboard">
      <Main>
        <Header title="Dashboard" hideBack />
        <div className="flex gap-5 lg:gap-10 flex-col md:max-w-none mx-auto lg:flex-row">
          <div className="flex flex-1 gap-5 lg:flex-col lg:gap-0 lg:max-w-[50vh]">
            <Panel header="Entrance">
              <iframe
                className="w-full h-full aspect-video border rounded-lg"
                src="/kiosk/entrance"
                title="kiosk-entrance"
              />
            </Panel>
            <Panel header="Exit">
              <iframe
                className="w-full h-full aspect-video border rounded-lg"
                src="/kiosk/exit"
                title="kiosk-exit"
              />
            </Panel>
          </div>
        </div>
      </Main>
    </StaffLayout>
  );
}

export default Dashboard;
