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
};

function Settings() {
  // [States]
  const [form, setForm] = useState<SettingsForm>(defaultState);
  const [isRequest, setRequest] = useState<boolean>(false);

  // [Hooks]
  const { info, isLoading } = useSettingsInfo();

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
            <Form placeholder="Set" onSubmit={handleOnSubmit}>
              <Input
                name="fee"
                type="number"
                placeholder={`Fee per day (Current: ${info?.fee.toFixed(2)} ฿)`}
                value={form.fee}
                setForm={setForm}
                required
                subfix="฿"
              />
            </Form>
          </Panel>

          <Panel header="Node's Configuration">
            <div className="flex flex-col gap-5">
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
