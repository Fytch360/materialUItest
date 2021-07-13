import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import { Button, Grid, Input, TextField } from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import FormDialog from "../components/modal";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "theme.palette.background.default",
  },
}));

export default function Tasks() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [colData, setColData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [taskName, setTaskName] = React.useState("");
  const [createdAfter, setCreatedAfter] = React.useState(null);
  const [createdBefore, setCreatedBefore] = React.useState(null);
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      search: search,
      created_at_after: createdAfter
        ? moment(createdAfter).format("DD.MM.YYYY")
        : null,
      created_at_before: createdBefore
        ? moment(createdBefore).format("DD.MM.YYYY")
        : null,
    },
  };
  useEffect(() => {
    axios
      .get(`http://65.21.178.123/api/v1/tasks/`, config)
      .then((res) => setColData(res.data.results));
  }, [search, createdAfter, createdBefore, open]);

  const columns = [
    {
      name: "name",
      label: "Наиманование",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "created_at",
      label: "Дата создания",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => {
          return moment(value).format("DD.MM.YYYY");
        },
      },
    },
    {
      name: "plan_end_at",
      label: "Дата завершения",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => {
          return moment(value).format("DD.MM.YYYY");
        },
      },
    },
    {
      name: "assignee",
      label: "Исполнитель",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => {
          return value.first_name;
        },
      },
    },
    {
      name: "patient",
      label: "Пациент",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => {
          return value?.first_name;
        },
      },
    },
    {
      name: "reception",
      label: "Приём",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => {
          return value?.date_time;
        },
      },
    },
  ];
  const onRowClick = (row) => {
    setTaskName(row[0]);
  };
  const options = {
    // filterType: "checkbox",
    onRowClick: onRowClick,
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Текущие задачи" {...a11yProps(0)} />
          <Tab label="Завершённые задачи" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Grid container>
          <Grid item xs={2}>
            <TextField
              label="Поиск по наименованию"
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>
          <Grid item>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="DD.MM.YYYY"
                margin="normal"
                id="date-picker-inline"
                label="Дата до"
                value={createdAfter}
                onChange={(e) => setCreatedAfter(e)}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="DD.MM.YYYY"
                margin="normal"
                id="date-picker-inline"
                label="Дата после"
                value={createdBefore}
                onChange={(e) => setCreatedBefore(e)}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item>
            <FormDialog data={colData} taskName={taskName} update={setSearch} />
          </Grid>
        </Grid>
        <MUIDataTable
          title={"Текущие задачи"}
          data={colData}
          columns={columns}
          options={options}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Завершённые задачи
      </TabPanel>
    </div>
  );
}
