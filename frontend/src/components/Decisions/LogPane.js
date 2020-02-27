import React from "react";
import {List, ListItem} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {logItemSelect, logChangeDisplayed} from "../../actions";
import {connect} from "react-redux";
import { Menu } from '@material-ui/core';
import { MenuItem } from '@material-ui/core';
import buildDict from '../../definitions/Buildings';
let buildings = Object.keys(buildDict);


/*function MakeLog(list, onLogClick, selectedIndex){
    let array = new Array(list.length);
    for (let i = 0; i < list.length; i++) {
        const index = i;
        const id = list[i].buildingType;
        const cells = list[i].selectedCells;
        const actionType = list[i].actionType;
        if(i === selectedIndex) {
            array[i] = (
                <ListItem key={index} button selected={true}>
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
                <ListItem key={index} button>
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
}*/

function makeCleanLog(cleanDisplayed, onLogSelect, selectedLogItem){
    let buyLog = cleanDisplayed.buy;
    let sellLog = cleanDisplayed.sell;
    let logArray = [];
    for(let i = 0; i < buildings.length; i++){
        const building = buildings[i];
        if(buyLog[building].length !== 0){
            let indexString = '';
            for(let j = 0; j < buyLog[building].length; j++){
                indexString = indexString + buyLog[building][j] + ', '
            }
            let selected = (selectedLogItem.action === 'buy' && selectedLogItem.building === building);
            logArray.push(
                <ListItem key={'buy ' + i} button selected={selected} onClick={onLogSelect(buyLog[building], building, 'buy')}>
                    <p><b>Building Type:</b>{' ' + buildDict[building].name} <br/> <b>Action Type:</b>{' Buy New Building'} <br/></p>
                </ListItem>
            )
        }
        if(sellLog[building].length !== 0){
            let indexString = '';
            for(let j = 0; j < sellLog[building].length; j++){
                indexString = indexString + sellLog[building][j] + ', '
            }
            let selected = (selectedLogItem.action === 'sell' && selectedLogItem.building === building);
            logArray.push(
                <ListItem key={'sell ' + i} button selected={selected} onClick={onLogSelect(sellLog[building], building, 'sell')}>
                    <p><b>Building Type:</b>{' ' + buildDict[building].name} <br/> <b>Action Type:</b>{' Sell Old Building'} <br/></p>
                </ListItem>
            )
        }
    }
    return logArray
}


function makeLogPlane({...props}){
    /*let anchor = null;
    const close = () => {
        anchor = null;
    };
    <Button onClick={props.onLogConfirm(props.commitChange.selectedLogIndex)} disabled={props.canConfirm} variant="outlined" fullWidth={true} >
                Undo Change
        <List>
            {MakeLog(props.commitChange.history[props.commitChange.displayedTurn], props.onLogSelect, props.selectedIndex)}
        </List>
            </Button>*/
    return (
        <div>
            <br/>
            <div>
                {SimpleMenu(props.commitChange.history.length, props.onLogHistoryChange, props.commitChange.displayedTurn)}
            </div>
            <div style={{maxHeight: 650, overflow: 'auto'}}>
            <List>
                {makeCleanLog(props.commitChange.historyClean[props.commitChange.displayedTurn], props.onLogSelect, props.commitChange.selectedLogItem)}
            </List>
            </div>
        </div>
    )
}


const mapStateToLogProps = (state) => {
    return {
        ...state.logStorage,
        canConfirm : canConfirmLog(state.logStorage.commitChange.selectedLogIndex.index, state.logStorage.commitChange.displayedTurn, state.logStorage.commitChange.currentTurn),
        selectedIndex: state.logStorage.commitChange.selectedLogIndex.index,
    };
};


const mapDispatchToLogProps = (dispatch) => {
    return {
        onLogSelect: (selectedCells, buildingType, actionType) => function(){ dispatch(logItemSelect(selectedCells, buildingType, actionType));},
        //onLogConfirm: (selectedItem) => (logItemConfirm(selectedItem.index, [...selectedItem.selectedDel], dispatch)),
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


class LogPane extends React.Component {

    render(){
        return (
            <ConnectedLogList/>
        )
    }
}


function SimpleMenu(historyLength, clickFunction, currentTimeStep) {

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
        let turn = 'Turn ' + i;
        array[historyLength - i] = <MenuItem onClick={clickHandle(i-1)}>{turn}</MenuItem>
    }

    return (
        <div>
            <div>{'Currently displayed turn: ' + (currentTimeStep + 1)}</div>
            <Button aria-controls="simple-menu" aria-haspopup="true" variant="outlined" onClick={handleClick}>
                {'Change Turn Displayed'}
            </Button>
            <div>
                <Menu variant={'enu'}
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                      PaperProps={{
                          style: {
                              width: 225,
                              maxHeight: 300,
                          },
                      }}
                 >
                    {array}
                </Menu>
            </div>
        </div>
    );
}

export default LogPane;