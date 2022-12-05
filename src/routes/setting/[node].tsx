import { useState } from "react";
import { JSONTree } from "react-json-tree";
import Badge from "../../components/Badge";
import { Button, Input } from "../../components/Form";
import { TransactionCard } from "../../components/Transaction";
import { JSONTreeTheme } from "../../constants/theme";
import {
  clearLicenseNumber,
  controlBarricade,
  setCarCms,
  setHoverCms,
  setStateInitial,
  useNodeInfo,
} from "../../helpers/setting";
import { StaffLayout, Header, Main, Panel } from "../../components/Layout";
import { EditNodeForm, Node } from "../../types/setting";
import { isModuleConnected } from "../../utils/datetime";
import Interval from "react-interval-rerender";

// [Default State]
const defaultState: EditNodeForm = {
  hover_cms: 0,
  car_cms: 0,
};

type Props = {
  node: Node;
};
function NodeControl({ node }: Props) {
  // [States]
  const [form, setForm] = useState<EditNodeForm>(defaultState);

  // [Hooks]
  const { info, isLoading, transaction, updateTime } = useNodeInfo(node);
  return (
    <StaffLayout
      select="Settings"
      title={`${node} Control`}
      isLoading={isLoading}
    >
      <Interval delay={1000}>
        {() => (
          <Main>
            <Header
              title={`${node} Control`}
              subTitle={`Updated on: ${updateTime}`}
            />
            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex flex-col flex-1 gap-2">
                <Panel header="Display">
                  <iframe
                    className="aspect-video border rounded-lg shadow-md"
                    src={`/kiosk/${node.toLowerCase()}`}
                    title={`kiosk-${node.toLowerCase()}`}
                  />
                </Panel>
                <Panel header="Controller Commands">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-justify items-center">
                      <div className="flex gap-3 flex-1">
                        <p className="font-medium">Barricade:</p>
                        <Badge
                          size="base"
                          color={
                            info?.controller.status.p_barricade
                              ? "green"
                              : "red"
                          }
                        >
                          {info?.controller.status.p_barricade
                            ? "Open"
                            : "Close"}
                        </Badge>
                      </div>
                      <div className="flex gap-3 flex-1">
                        <Button
                          color="green"
                          onClick={async () =>
                            await controlBarricade(node, "open")
                          }
                        >
                          Open
                        </Button>
                        <Button
                          onClick={async () =>
                            await controlBarricade(node, "close")
                          }
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Input
                          type="number"
                          name="hover_cms"
                          placeholder={`Hover Cms (Current: ${
                            info?.controller.config.hover_cms
                          } ${
                            (info?.controller.config.hover_cms as number) > 1
                              ? "cms"
                              : "cm"
                          })`}
                          value={form.hover_cms}
                          setForm={setForm}
                        />
                        <Button
                          onClick={async () => {
                            await setHoverCms(node, form.hover_cms);
                            setForm((f) => ({
                              ...f,
                              hover_cms: defaultState.hover_cms,
                            }));
                          }}
                        >
                          Set
                        </Button>
                      </div>
                      <div className="flex-1">
                        <Input
                          type="number"
                          name="car_cms"
                          placeholder={`Car Cms (Current: ${
                            info?.controller.config.car_cms
                          } ${
                            (info?.controller.config.car_cms as number) > 1
                              ? "cms"
                              : "cm"
                          })`}
                          value={form.car_cms}
                          setForm={setForm}
                        />
                        <Button
                          onClick={async () => {
                            await setCarCms(node, form.car_cms);
                            setForm((f) => ({
                              ...f,
                              car_cms: defaultState.car_cms,
                            }));
                          }}
                        >
                          Set
                        </Button>
                      </div>
                    </div>
                  </div>
                </Panel>
                <Panel header="ALPR Commands">
                  <Button onClick={async () => await clearLicenseNumber(node)}>
                    Clear License Numbers
                  </Button>
                </Panel>
                <Panel header="State Commands">
                  <Button onClick={async () => await setStateInitial(node)}>
                    Set Initial State
                  </Button>
                </Panel>
              </div>
              <div className="flex-1">
                <Panel
                  header="State Info"
                  btns={[
                    <Badge
                      size="base"
                      color={
                        isModuleConnected(
                          info?.state.connected_timestamp as string
                        )
                          ? "green"
                          : "red"
                      }
                    >
                      {isModuleConnected(
                        info?.state.connected_timestamp as string
                      )
                        ? "Connected"
                        : "Disconnected"}
                    </Badge>,
                  ]}
                >
                  <div>
                    <p className="font-medium">Status:</p>
                    <JSONTree
                      data={info?.state.status}
                      theme={JSONTreeTheme}
                      hideRoot
                      shouldExpandNode={() => true}
                    />
                  </div>
                  {transaction && (
                    <div className="flex flex-col gap-2">
                      <p className="font-medium">Transaction Refernce:</p>
                      <div className="border border-b-0">
                        <TransactionCard transaction={transaction} />
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3 items-center">
                    <p className="font-medium">Command:</p>
                    <p className="w-full border px-3 py-1 font-light rounded-md shadow">
                      {info?.state.command
                        ? info.state.command
                        : "No command executed."}
                    </p>
                  </div>
                </Panel>
                <Panel
                  header="ALPR Info"
                  btns={[
                    <Badge
                      size="base"
                      color={
                        isModuleConnected(
                          info?.alpr.connected_timestamp as string
                        )
                          ? "green"
                          : "red"
                      }
                    >
                      {isModuleConnected(
                        info?.alpr.connected_timestamp as string
                      )
                        ? "Connected"
                        : "Disconnected"}
                    </Badge>,
                  ]}
                >
                  <div>
                    <p className="font-medium">Status:</p>
                    <JSONTree
                      data={info?.alpr.status}
                      theme={JSONTreeTheme}
                      hideRoot
                      shouldExpandNode={() => true}
                    />
                  </div>
                  <div className="flex gap-3 items-center">
                    <p className="font-medium">Command:</p>
                    <p className="w-full border px-3 py-1 font-light rounded-md shadow">
                      {info?.alpr.command
                        ? info.alpr.command
                        : "No command executed."}
                    </p>
                  </div>
                </Panel>
                <Panel
                  header="Controller Info"
                  btns={[
                    <Badge
                      size="base"
                      color={
                        isModuleConnected(
                          info?.controller.connected_timestamp as string
                        )
                          ? "green"
                          : "red"
                      }
                    >
                      {isModuleConnected(
                        info?.controller.connected_timestamp as string
                      )
                        ? "Connected"
                        : "Disconnected"}
                    </Badge>,
                  ]}
                >
                  <div>
                    <p className="font-medium">Configuration:</p>
                    <JSONTree
                      data={info?.controller.config}
                      theme={JSONTreeTheme}
                      hideRoot
                      shouldExpandNode={() => true}
                    />
                  </div>
                  <div>
                    <p className="font-medium">Status:</p>
                    <JSONTree
                      data={info?.controller?.status}
                      theme={JSONTreeTheme}
                      hideRoot
                      shouldExpandNode={() => true}
                    />
                  </div>
                  <div className="flex gap-3 items-center">
                    <p className="font-medium">Command:</p>
                    <p className="w-full border px-3 py-1 font-light rounded-md shadow">
                      {info?.controller.command
                        ? info.controller.command
                        : "No command executed."}
                    </p>
                  </div>
                </Panel>
              </div>
            </div>
          </Main>
        )}
      </Interval>
    </StaffLayout>
  );
}

export default NodeControl;
