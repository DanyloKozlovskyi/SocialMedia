import React from "react";
import { Modal, Box } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import dayjs, { Dayjs } from "dayjs";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
};

interface CalendarModalProps {
  open: boolean;
  onClose: () => void;
  onDateSelect: (date: Dayjs) => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  open,
  onClose,
  onDateSelect,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticDatePicker
            defaultValue={dayjs()}
            onChange={(newValue) => {
              if (newValue) {
                onDateSelect(newValue);
              }
            }}
            onAccept={onClose}
            slotProps={{
              actionBar: {
                actions: [],
              },
            }}
          />
        </LocalizationProvider>
      </Box>
    </Modal>
  );
};
