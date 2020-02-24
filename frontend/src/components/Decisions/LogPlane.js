import React from "react";
import {List, ListItem} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {logItemConfirm, logItemSelect, logChangeDisplayed} from "../../actions";
import {connect} from "react-redux";
import { Menu } from '@material-ui/core';
import { MenuItem } from '@material-ui/core';


function MakeLog(list, onLogClick, selectedIndex){
    let array = new Array(list.length);
    for (let i = 0; i < list.length; i++) {
        const index = i;
        const id = list[i].buildingType;
        const cells = list[i].selectedCells;
        const actionType = list[i].actionType;
        if(i === selectedIndex) {
            array[i] = (
                <ListItem button selected={true}>
                    <ul onClick={onLogClick(index)} type="square">
                        <li>{'Action ' + (index + 1)}</li>
                        <li>{'Action Type - ' + actionType}</li>
                        <li>{'Building affected - ' + id}</li>
                        <li>{'Building locations - ' + cells}</li>
                    </ul>
                    </ListItem>
            )
        }
        else{
            array[i] = (
                <ListItem button>
                    <ul onClick={onLogClick(index)} type="square">
                        <li>{'Action ' + (index + 1)}</li>
                        <li>{'Action Type - ' + actionType}</li>
                        <li>{'Building affected - ' + id}</li>
                        <li>{'Building locations - ' + cells}</li>
                    </ul>
                    </ListItem>
            )
        }
    }
    return array;
}


function makeLogPlane({...props}){
    let anchor = null;
    const close = () => {
        anchor = null;
    };
    console.log(props.commitChange.displayedTurn);
    return (
        <div>
            <Button onClick={props.onLogConfirm(props.commitChange.selectedLogIndex)} disabled={props.canConfirm} variant="outlined" fullWidth={true} >
                Undo Change
            </Button>
                {SimpleMenu(props.commitChange.history.length, props.onLogHistoryChange)}
            <div>
                One you have made a change it will appear in this log.
            </div>
            <div>
                Click on an action and press 'Undo Change' to revert back to before that change.
            </div>
            <div style={{maxHeight: 600, overflow: 'auto'}}>
            <List>
                {MakeLog(props.commitChange.history[props.commitChange.displayedTurn], props.onLogSelect, props.selectedIndex)}
            </List>
            </div>
        </div>
    )
}


const mapStateToLogProps = (state, ownProps) => {
    return {
        ...state.logStorage,
        canConfirm : canConfirmLog(state.logStorage.commitChange.selectedLogIndex.index, state.logStorage.commitChange.displayedTurn, state.logStorage.commitChange.currentTurn),
        selectedIndex: state.logStorage.commitChange.selectedLogIndex.index,
    };
};


const mapDispatchToLogProps = (dispatch, ownProps) => {
    return {
        onLogSelect: (index) => function(){ dispatch(logItemSelect(index));},
        onLogConfirm: (selectedItem) => (logItemConfirm(selectedItem.index, [...selectedItem.selectedDel], dispatch)),
        onLogHistoryChange: (index) => dispatch(logChangeDisplayed(index)),
    }
};


const ConnectedLogList = connect(
    mapStateToLogProps,
    mapDispatchToLogProps,
)(makeLogPlane);


function canConfirmLog(indexState, displayed, current){
    return (indexState === "undefined" && displayed === current);
}


class LogPlane extends React.Component {

    render(){
        return (
            <ConnectedLogList/>
        )
    }
}


function SimpleMenu(historyLength, clickFunction) {

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const clickHandle = (index) => function(){
        clickFunction(index);
        setAnchorEl(null);
    };

    let array = new Array(historyLength);
    for(let i = 1; i < historyLength + 1; i++){
        let turn = 'Turn' + i;
        array[i] = <MenuItem onClick={clickHandle(i-1)}>{turn}</MenuItem>
    }

    return (
        <div>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                Time Steps
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {array}
            </Menu>
        </div>
    );
}

export default LogPlane;