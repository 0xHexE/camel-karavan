/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import {
    Card, CardBody, CardHeader, Gallery, Modal,
    Tab, Tabs, TabTitleText,
    Text,
} from '@patternfly/react-core';
import '../karavan.css';
import {CamelUi} from "../api/CamelUi";

interface Props {
    show: boolean,
    onDslSelect: any
    onClose: any
    parentId: string
    parentType: string
}

interface State {
    show: boolean
    tabIndex: string | number
}

export class DslSelector extends React.Component<Props, State> {

    public state: State = {
        show: this.props.show,
        tabIndex: CamelUi.getSelectorLabels(this.props.parentType)[0][0],
    };

    componentDidMount() {
    }

    selectTab = (evt: React.MouseEvent<HTMLElement, MouseEvent>, eventKey: string | number) => {
        this.setState({tabIndex: eventKey})
    }

    componentDidUpdate = (prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) => {
        if (prevState.show !== this.props.show) {
            this.setState({show: this.props.show});
        }
        if (prevProps.parentType !== this.props.parentType) {
            this.setState({tabIndex: CamelUi.getSelectorLabels(this.props.parentType)[0][0]});
        }
    }

    selectDsl = (evt: React.MouseEvent, dsl: any) => {
        evt.stopPropagation()
        this.setState({show: false})
        this.props.onDslSelect.call(this, dsl, this.props.parentId);
    }

    render() {
        return (
            <Modal
                title={this.props.parentType === undefined ? "Select source/from" : "Select step"}
                width={'90%'}
                className='dsl-modal'
                isOpen={this.state.show}
                onClose={() => this.props.onClose.call(this)}
                actions={{}}>
                <Tabs style={{overflow: 'hidden'}} activeKey={this.state.tabIndex} onSelect={this.selectTab}>
                    {CamelUi.getSelectorLabels(this.props.parentType).map((label, index) => (
                        <Tab eventKey={label[0]} key={"tab-" + label[0]}
                        title={<TabTitleText>{CamelUi.capitalizeName(label[0])}</TabTitleText>} translate={undefined} onAuxClick={undefined} onAuxClickCapture={undefined}>
                            <Gallery key={"gallery-" + label[0]} hasGutter className="dsl-gallery">
                                {CamelUi.sortSelectorModels(CamelUi.getSelectorModels(label[0], label[1], this.props.parentType)).map((dsl, index) => (
                                    <Card key={dsl.name + index} isHoverable isCompact className="dsl-card"
                                          onClick={event => this.selectDsl(event, dsl)}>
                                        <CardHeader>
                                            <img draggable={false}
                                                 src={dsl.uri && dsl.uri.startsWith("kamelet") ? CamelUi.getKameletIcon(dsl.uri) : CamelUi.getIconForName(dsl.name)}
                                                 style={dsl.name === 'choice' ? {height: "18px"} : {}}  // find better icon
                                                 className="icon" alt="icon"></img>
                                            <Text>{dsl.title}</Text>
                                        </CardHeader>
                                        <CardBody>
                                            <Text>{dsl.description}</Text>
                                        </CardBody>
                                    </Card>
                                ))}
                            </Gallery>
                        </Tab>
                    ))}
                </Tabs>
            </Modal>
        );
    }
}