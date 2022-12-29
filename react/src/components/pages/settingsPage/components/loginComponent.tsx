import { checkUser } from "api/user";
import { useAppContext } from "App";
import LabelInput from "components/common/formComponents/labelInput";
import { FormEvent, useState } from "react";

export default function LoginComponent() {
  const { appUser, setAppUser } = useAppContext();
  const [queryStatus, setQueryStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handlePhoneSubmit = (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      phone: {
        value: string;
      };
    };

    setQueryStatus("loading");
    return setTimeout(() => {
      setPhone(target.phone.value.replace(/-/g, ""));
      setQueryStatus("idle");
    }, 200);
  };

  const handleAccessCodeSubmit = async (e: FormEvent) => {
    setQueryStatus("loading");

    e.preventDefault();
    const target = e.target as typeof e.target & {
      accesscode: {
        value: string;
      };
    };

    const user = await checkUser(phone, target.accesscode.value);
    if (user.error) {
      setQueryStatus("error");
      setError("code is incorrect, please contact support");
    } else if (user?.user?.id) {
      setQueryStatus("success");
      setAppUser({
        ...user,
      });
    } else {
      setQueryStatus("success");
    }
  };

  const handleLogout = () => {
    setAppUser(null);
    setQueryStatus("idle");
    setPhone("");
  };

  return (
    <div className="login-container">
      {queryStatus === "loading" ? (
        "loading"
      ) : queryStatus === "success" || appUser ? (
        <div>
          <span>Current User: {appUser?.user.fields.phone}</span>
          <button type="button" className="form-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : !phone ? (
        <form onSubmit={handlePhoneSubmit}>
          <LabelInput
            type={"tel"}
            children={undefined}
            label={"Phone Number"}
            For={"phone"}
            name={"phone"}
            pattern={`[0-9]{3}-[0-9]{3}-[0-9]{4}`}
            helperText={`i.e. 123-456-7890`}
            required
          />
          <button type="submit" className="form-button ">
            Login
          </button>
        </form>
      ) : (
        <form onSubmit={handleAccessCodeSubmit}>
          <p>Please use the 6 digit code that was sent</p>
          <LabelInput
            type={"tel"}
            children={undefined}
            label={"Access Code"}
            For={"accesscode"}
            name={"accesscode"}
            pattern={`[0-9]{6}`}
            required
          />
          {error && error}
          <button type="submit" className="form-button ">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
