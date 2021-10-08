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
import * as React from "react";
import {
    Page,
} from "@patternfly/react-core";
import {KaravanDesigner} from "./designer/ui/KaravanDesigner";
import {KameletApi} from "./designer/api/KameletApi";
import {ComponentApi} from "./designer/api/ComponentApi";

interface Props {
}

interface State {
    name: string
    yaml: string
    key: string
}

class App extends React.Component<Props, State> {

    public state: State = {
        name: '',
        yaml: '',
        key: ''
    };


    componentDidMount() {
        ["http-secured-sink.kamelet.yaml",
        "http-secured-source.kamelet.yaml",
        "http-sink.kamelet.yaml",
        "http-source.kamelet.yaml",
        "insert-field-action.kamelet.yaml",
        "insert-header-action.kamelet.yaml",
        "kafka-not-secured-sink.kamelet.yaml",
        "kafka-not-secured-source.kamelet.yaml",
        "kafka-sink.kamelet.yaml",
        "kafka-source.kamelet.yaml"].forEach(name =>
            fetch("kamelets/" + name)
                .then((r) => r.text())
                .then(value => KameletApi.saveKamelet(value)));

        ["bonita.json",
            "jms.json",
            "sql.json",
            "file.json",
            "log.json",
            "kubernetes-service-accounts.json",
            "mvel.json"].forEach(name =>
            fetch("components/" + name)
                .then((r) => r.text())
                .then(value => ComponentApi.saveComponent(value)));
    }

    save(name: string, yaml: string) {
        console.log(yaml);
    }

    public render() {
        return (
            <Page className="karavan">
                <KaravanDesigner key={this.state.key} name={this.state.name} yaml={this.state.yaml}
                                 onSave={(name, yaml) => this.save(name, yaml)}/>
            </Page>
        );
    }
}

export default App;
