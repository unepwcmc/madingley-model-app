import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import PlayArrow from "@material-ui/icons/PlayArrow";

import TabsPane from "../util/TabsPane";
import BuildingPane from "./BuildingPane";

import "./Decisions.css";

class Decisions extends React.Component {

    objectPlaceholder = {
        icon: 'unknown.svg',
        income: 0,
        cost: 100,
        killRate: 10,
        cellNo: 0
    };

    render() {

        const {onNextTurn, onDecisionStuff} = this.props;

        const tabs = ["Food", "Forestry", "Population", "Energy"];

        return (
            <div className="Decisions-root panel">
                <TabsPane variant="scrollable" tabs={tabs}>
                    {/*Food*/}
                    <div>
                        {/*Agriculture*/}
                        <BuildingPane name="Animal Farm" numberBuilt={3} canBuy onBuy={() => console.log("buy")} onSell={() => console.log("sell")}>
                            Rear animals to produce food.
                        </BuildingPane>

                        {/*Fisheries*/}
                        <BuildingPane name="Fishing Boat" numberBuilt={2} canBuy onBuy={() => onDecisionStuff("fish")} onSell={() => console.log("sell")}>
                            A boat to catch fish in the ocean.
                        </BuildingPane>
                        {/*TODO Slider for effort*/}

                        {/*Hunting*/}
                        <BuildingPane name="Hunting Shack" numberBuilt={4} canBuy>
                            Hire hunters to harvest wild animals.
                        </BuildingPane>
                    </div>

                    {/*Forestry*/}
                    <div>
                        <BuildingPane name="Cheap Lumber mill" numberBuilt={2} canBuy>
                            Cuts down trees to produce wood. Substantial impact on the ecosystem.
                        </BuildingPane>
                        <BuildingPane name="Expensive Lumber mill" numberBuilt={0} canBuy>
                            Cuts down trees to produce wood sustainably with less pollution.
                        </BuildingPane>
                    </div>

                    {/*Population*/}
                    <div>
                        {/*TODO*/}
                        <ul>
                            <li>
                                Taxes
                                <ul>
                                    <li>Main source of money</li>
                                    <li>Slider: balance amount of tax and happiness</li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                    {/*Energy*/}
                    <div>
                        <BuildingPane name="Coal Power Plant" numberBuilt={2} canBuy>
                            Generate electricity by burning coal.
                        </BuildingPane>
                        <BuildingPane name="Wind Turbine" numberBuilt={1} canBuy>
                            Generate electricity by harnessing the wind.
                        </BuildingPane>
                    </div>
                </TabsPane>
                <div className="filler"/>
                <div className="Decisions-nextTurn">
                    <Button onClick={onNextTurn} size="large" fullWidth startIcon={<PlayArrow/>}>Next turn</Button>
                </div>
            </div>
        );
    }
}

Decisions.propTypes = {
    onNextTurn: PropTypes.func,
    onDecisionStuff: PropTypes.func,
};

export default Decisions;