import { ChevronRightIcon } from "@heroicons/react/24/solid";
import generatePayload from "promptpay-qr";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";
import { Button, Form, Input } from "../../components/Form";
import { setSettings, useSettingsInfo } from "../../helpers/setting";
import { StaffLayout, Main, Header, Panel } from "../../components/Layout";
import { SettingsForm } from "../../types/setting";
import thai_qr_payment from "../../assets/thai-qr-payment.png";
import thai_qr_logo from "../../assets/thai-qr-logo.png";

const defaultState = {
  fee: 0,
  promptpay: "",
};

function Settings() {
  // [States]
  const [form, setForm] = useState<SettingsForm>(defaultState);
  const [isRequest, setRequest] = useState<boolean>(false);

  // [Hooks]
  const { info, isLoading } = useSettingsInfo();

  // [Data]
  const qrCodePayload = generatePayload(form.promptpay, {
    amount: form.fee ?? 0,
  });

  // [Effects]
  // E - Set settings info to form.
  useEffect(() => {
    if (info) {
      setForm(info);
    }
  }, [info]);

  // [Functions]
  const handleOnSubmit = async () => {
    try {
      setRequest(true);
      await setSettings(form);
    } finally {
      setRequest(false);
    }
  };

  return (
    <StaffLayout
      select="Settings"
      isLoading={isLoading || isRequest}
      title="Settings"
    >
      <Main>
        <Header title="Settings" hideBack />
        <div className="flex flex-col mx-auto lg:max-w-2xl gap-5 flex-1">
          <Panel header="Payments">
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="w-full flex flex-col justify-center gap-5 py-5 flex-1">
                <div className="bg-white p-2 w-[80%] rounded-lg h-auto aspect-square flex justify-center items-center mx-auto shadow-md border relative">
                  <QRCode
                    value={qrCodePayload}
                    size={256}
                    style={{
                      height: "auto",
                      maxWidth: "100%",
                      width: "100%",
                    }}
                    viewBox={`0 0 256 256`}
                  />
                  <img
                    src={thai_qr_logo}
                    className="absolute top-0 left-0 right-0 bottom-0 w-full h-full object-scale-down p-[35%]"
                    alt=""
                  />
                </div>
                <div className="text-zinc-500 border shadow-md flex items-center justify-center gap-1 w-[80%] mx-auto rounded-lg h-10 pr-1">
                  <img
                    src={thai_qr_payment}
                    alt=""
                    className="h-full w-auto rounded-l-lg flex-0"
                  />
                  <p className="font-medium ml-2 flex-1 text-center">
                    {`฿ ${form.fee.toFixed(2)}`}
                  </p>
                  <ChevronRightIcon className="w-5 h-5 flex-0" />
                </div>
              </div>
              <div className="flex-1">
                <Form placeholder="Set" onSubmit={handleOnSubmit}>
                  <Input
                    name="fee"
                    type="number"
                    placeholder={`Fee per day (Current: ${info?.fee.toFixed(
                      2
                    )} ฿)`}
                    value={form.fee}
                    setForm={setForm}
                    required
                    subfix="฿"
                  />
                  <Input
                    name="promptpay"
                    placeholder={`Prompt-Pay ID (Current: ${info?.promptpay})`}
                    value={form.promptpay}
                    setForm={setForm}
                    required
                  />
                </Form>
              </div>
            </div>
          </Panel>

          <Panel header="Node's Configuration">
            <div className="flex flex-col gap-5 md:flex-row">
              <Link to="/setting/entrance" className="w-full">
                <Button>Entrance</Button>
              </Link>
              <Link to="/setting/exit" className="w-full">
                <Button>Exit</Button>
              </Link>
            </div>
          </Panel>
        </div>
      </Main>
    </StaffLayout>
  );
}

export default Settings;
