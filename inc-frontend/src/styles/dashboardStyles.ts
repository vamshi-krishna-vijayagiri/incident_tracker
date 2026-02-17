import { SxProps, Theme } from "@mui/material/styles";

export const dashboardTableStyles: SxProps<Theme> = {
  "& td": {
    padding: "0px 12px",
    lineHeight: "10px",
  },
  "& th": {
    padding: "0px 12px",
    height: "50px",
    fontWeight: "bold",
  },
  "& tbody tr:nth-of-type(odd)": {
    backgroundColor: "#f5f5f5",
  },
  "& tbody tr:nth-of-type(even)": {
    backgroundColor: "#ffffff",
  },
};
