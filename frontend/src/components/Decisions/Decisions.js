import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import PlayArrow from "@material-ui/icons/PlayArrow";

import TabsPane from "../util/TabsPane";

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

        const tabs = ["Agriculture", "Fisheries", "Forestry", "Population", "Hunting", "Energy"];

        return (
            <div className="Decisions-root panel">
                <TabsPane variant="scrollable" tabs={tabs}>
                    {/*Agriculture*/}
                    <div>
                        <ul>
                            <li>Build (insert animal) farm</li>
                            <Button>Animal Farm</Button>
                        </ul>
                    </div>

                    {/*Fisheries*/}
                    <div>
                        <ul>
                            <li>Build/sell fishing boat (each boat goes in a cell in the map) -- produces food</li>
                            <Button onClick={() => onDecisionStuff("fish")}>Fishing boat</Button>
                            <li>Slider for effort</li>
                        </ul>
                    </div>

                    {/*Forestry*/}
                    <div>
                        <ul>
                            <li>
                                Lumber mill
                                <ul>
                                    <li>Per cell</li>
                                    <li>
                                        Multiple options
                                        <ul>
                                            <li>
                                                Cheap: More pollution and doesn't replant
                                            </li>
                                            <Button >Cheap Mill</Button>
                                            <li>
                                                Expensive: Less pollution and more sustainable (Same payoff, less impact on ecosystem)
                                            </li>
                                            <Button>Expensive Mill</Button>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                    {/*Population*/}
                    <div>
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

                    {/*Hunting*/}
                    <div>
                        <ul>
                            <li>Kill animals for food</li>
                            <li>Hire hunters per cell</li>
                            <Button >Hire Hunter</Button>
                        </ul>
                    </div>

                    {/*Energy*/}
                    <div>
                        <ul>
                            <li>Electricity: Keep number higher than needs (depend on population)</li>
                            <li>Build coal plant</li>
                            <Button >Coal Plant</Button>
                            <li>Build wind turbine</li>
                            <Button >Wind Turbine</Button>
                        </ul>
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