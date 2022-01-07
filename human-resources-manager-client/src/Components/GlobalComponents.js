import { makeStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';

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
    }
}));

export const DarkTextField = ({ onChange, label, name, type }) => {
    return (
        <StyledTextField
            onChange={onChange}
            label={label}
            name={name}
            type={type}
        />
    );
};

export const DarkSelect = ({ onChange, label, name, value, firstVal, collection }) => {
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
                defaultValue=""
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
                            <MenuItem id={"permissionMenuItem" + item.id} key={index} value={item}>{item.name}</MenuItem>
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

export default {
    DarkChipList,
    DarkSelect,
    DarkTextField
};