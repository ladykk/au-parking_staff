import Feedback from "../components/Feedback";

function FourOhFour() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Feedback
        header="Error 404"
        message="This page could not be found."
        type="Error"
      />
    </div>
  );
}

export default FourOhFour;
