import { ConfirmSeal } from "@/utils/constant";

interface AppointmentActionsProps {
  acknowledgment: {
    isWorkCompletedByProvider: boolean,
    imageUrl: string[],
    isWorkConfirmedByUser: boolean,
  };
}

const AppointmentActions: React.FC<AppointmentActionsProps> = ({ acknowledgment }) => {
  return (
    <>
      <div className="absolute flex items-center pt-4 opacity-55 xl:static sm:left-75 md:left-82 lg:left-110">
        {acknowledgment.isWorkCompletedByProvider &&
          acknowledgment.isWorkConfirmedByUser && (
          <p>
            <img
              src={ConfirmSeal}
              alt="workCompleted"
              className="w-30 sm:w-30 md:w-35 lg:w-40"
            />
          </p>
        )}
      </div>
    </>
  );
};

export default AppointmentActions;