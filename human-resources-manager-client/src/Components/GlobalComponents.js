import { makeStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import Card from "@material-ui/core/Card";
import Typography from '@material-ui/core/Typography';
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const StyledTextField = withStyles({
    root: {

        '& .MuiInputBase-root': {
            color: "white",
            marginRight: "10px",
            marginLeft: "20px",
            marginBottom: "11px",
        },

        '& .MuiFormLabel-root': {
            color: "#999999",
            marginLeft: "20px",
        },

        '& label.Mui-focused': {
            color: 'white',
        },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottomColor: 'white',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'white',
        },
        '& .MuiInput-underline:before': {
            borderBottomColor: '#999999',
        },
        '& input[type="password" i]': {
            webkitTextSecurity: 'disc !important'
        }
    },
})(TextField);

const StyledSelectFC = withStyles({
    root: {
        '& .MuiInputBase-root': {
            color: "white",
            marginRight: "10px",
            marginLeft: "20px",
            marginBottom: "11px",
        },

        '& .MuiFormLabel-root': {
            color: "#999999",
            marginLeft: "20px",
        },

        '& label.Mui-focused': {
            color: 'white',
        },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottomColor: 'white',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'white',
        },
        '& .MuiInput-underline:before': {
            borderBottomColor: '#999999',
        },
        '& .MuiSelect-icon': {
            color: '#999999',
        },
    },
})(FormControl);

const BorderLinearProgress = withStyles((theme) => {
    return {
        root: {
            borderRadius: "6px",
            width: "32px",
            height: "100%",
            marginBottom: "2px"
        },
        colorPrimary: {
            boxShadow: 'inset 0px 3px 3px -2px rgb(0 0 0 / 20%), inset 0px 3px 4px 0px rgb(0 0 0 / 14%), inset 0px 1px 8px 0px rgb(0 0 0 / 12%), ' + theme.shadows[1],
            backgroundColor: '#a9a6a6',
            borderRadius: '4px',
        },
        bar: {
            borderRadius: "6px",
            boxShadow: theme.shadows[3],
            transform: ({ value }) => {
                return `translateY(${value}%) !important`;
            },
            backgroundColor: ({ bcolor }) => { return bcolor }
        },
    };
})(LinearProgress);

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 138,
    },
    darkChipListBox: {
        display: 'flex',
    },
    chipListContainer: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        paddingTop: "12px",
        width: "max-content",
        margin: "0",
    },
    chipItem: {
        margin: theme.spacing(0.5),
    },
    title: {
        color: theme.palette.text.primary,
        textAlign: 'center',
        padding: '2px 6px 2px',
        marginBottom: '5px',
        backgroundColor: theme.palette.primary.main,
        boxShadow: theme.shadows[2],
        width: '100%',
    },
    barBox: {
        minHeight: "160px",
        display: "flex",
        padding: "0",
        margin: '6px',
        width: "max-content",
        boxshadow: theme.shadows[2]
    },
    stats: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: '#bdbdbd',
        color: 'black'
    }
}));

export const DarkTextField = ({ onChange, label, name, type, maxRows, value, defaultValue, disabled }) => {
    return (
        <StyledTextField
            onChange={onChange}
            multiline={maxRows !== undefined ? true : false}
            maxRows={maxRows}
            label={label}
            name={name}
            type={type}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
        />
    );
};

export const DarkSelect = ({ onChange, label, name, value, firstVal, collection, defaultValue }) => {
    const classes = useStyles();
    return (
        <StyledSelectFC className={classes.formControl}>
            <InputLabel id="select-params-label">{label}</InputLabel>
            <Select
                labelId="select-params-label"
                id="select-params"
                name={name}
                onChange={onChange}
                value={value}
                defaultValue={defaultValue === undefined ? '' : defaultValue}
            >
                {
                    firstVal === undefined ? null :
                        <MenuItem key={0} value={firstVal.id} >{firstVal.name}</MenuItem>
                }
                {collection === undefined ? null :
                    collection.map((item, index) => (
                        <MenuItem key={index + 1} value={item}>{item.name}</MenuItem>
                    ))
                }
            </Select>
        </StyledSelectFC>
    );
};

export const DarkChipList = ({ onChange, label, name, value, firstVal, firstLabel, collection, clipListCollection, onDelete }) => {
    const classes = useStyles();
    return (
        <div className={classes.darkChipListBox}>
            <StyledSelectFC className={classes.formControl}>
                <InputLabel id="select-params-label">{label}</InputLabel>
                <Select
                    labelId="select-params-label"
                    id="select-params"
                    name={name}
                    onChange={onChange}
                    value={value}
                >
                    {firstVal === undefined ? <div></div> :
                        <MenuItem value={firstVal}>{firstLabel}</MenuItem>
                    }
                    {collection === undefined ? <div></div> :
                        collection.map((item, index) => (
                            <MenuItem id={"chipMenuItem" + item.id} key={"chipKey" + item.id} value={item}>{item.name}</MenuItem>
                        ))
                    }
                </Select>
            </StyledSelectFC>
            <ul className={classes.chipListContainer}>
                {clipListCollection === undefined ? <div></div> :
                    clipListCollection.map((data, index) => {
                        return (
                            <li key={index}>
                                <Chip
                                    className={classes.chipItem}
                                    label={data.name}
                                    onDelete={() => onDelete(data)}
                                />
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
};

export const StatBar = ({ valueMax, valueCurrent, text, bcolor }) => {
    const classes = useStyles();

    const barLvl = valueMax === 0 && valueCurrent === 0 ? 100 :
        100 - (valueCurrent * 100) / valueMax;

    return (
        <Card className={classes.barBox}>

            <div className={classes.stats}>
                <div className={classes.title}>
                    <Typography noWrap variant="body2">{text}</Typography>
                </div>
                <BorderLinearProgress variant="determinate" bcolor={bcolor} value={barLvl} />
                <Typography variant="button">{Math.round(100 - barLvl)}%</Typography>
            </div>
        </Card>
    );
}

export const ConfirmDialog = (props) => {
    const { title, children, open, setOpen, onConfirm } = props;
    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="confirm-dialog"
        >
            <DialogTitle id="confirm-dialog">{title}</DialogTitle>
            <DialogContent>{children}</DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={() => setOpen(false)}
                    color="secondary"
                >
                    No
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        setOpen(false);
                        onConfirm();
                    }}
                    color="default"
                >
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export const InfoDialog = (props) => {
    const { title, children, open, setOpen, onConfirm } = props;
    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="info-dialog"
        >
            <DialogTitle style={{ padding: '16px 29px 0' }} id="info-dialog">
                <h3 style={{ margin: 0 }}>{title}</h3>
            </DialogTitle>
            <DialogContent>{children}</DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={() => {
                        setOpen(false);
                        onConfirm();
                    }}
                    color="default"
                >
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default {
    DarkChipList,
    DarkSelect,
    DarkTextField,
    StatBar,
    ConfirmDialog,
    InfoDialog
};