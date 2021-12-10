import React from 'react';
import './Home.scss';
import { Row, Col, Card, CardBody, CardFooter, Spinner } from 'reactstrap';
import { CONTENT_DATA } from '../../services/Data';
import conceptIcon from '../../../assets/Images/ideas.png';
import { Route } from 'react-router-dom';
import ExploreWS from '../exploreworkspace/ExploreWS';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            contentData: [],
            selectedHomeCard: {},
            routeData: [],
            selectedHomeCardRoute: {},
            level: 0,
            searchText: '',
        }
    }

    componentDidMount() {
        let contentData = CONTENT_DATA

        this.buildRoute(contentData)

        this.setState({
            contentData: contentData, isLoading: false,
        })
    }
    buildRoute(contentDataParam) {
        let data = contentDataParam
        let { routeData } = this.state

        if (data.length > 0) {
            for (const dataObj of data) {
                if (dataObj.type === "site") {
                    let routeObj = {
                        id: dataObj.id,
                        to: "/" + dataObj.id,
                        exact: true,
                        label: dataObj.title,
                        component: ExploreWS,
                        icon: "fa fa-home",
                        type: "home",
                        children: []
                    }
                    routeData.push(routeObj)

                    for (const blockObj of data) {
                        if (blockObj.type === "block" && blockObj.parent === routeObj.id) {
                            for (const topicObj of data) {
                                if (topicObj.type === "topic" && topicObj.parent === blockObj.id) {
                                    let topicRouteObj = {
                                        id: topicObj.id,
                                        to: "/" + topicObj.id,
                                        exact: true,
                                        label: topicObj.title,
                                        component: undefined,
                                        icon: "fa fa-angle-down",
                                        type: "expand",
                                        children: [],
                                    }
                                    routeObj.children.push(topicRouteObj)
                                }
                            }
                        }
                    }
                }
            }
        }
        this.setState({ routeData: routeData })
    }
    addHomeCard() {
        let { contentData, routeData } = this.state;
        let today = new Date();
        let uid = Math.floor(Math.random() * 0xfffff * today.getTime()).toString(16);
        let date = today.getFullYear() + ':' + (today.getMonth() + 1) + ':' + today.getDate();

        let siteObj = {
            id: "ws" + uid,
            title: "Work space",
            description: "Edit description here",
            createdAt: date,
            type: 'site',
            concept: "Hello Welcome",
            conceptImg: conceptIcon,
            parent: undefined,
        }
        let routeObj = {
            id: siteObj.id,
            to: "/" + siteObj.id,
            exact: true,
            label: siteObj.title,
            component: ExploreWS,
            icon: "fa fa-home",
            type: "home",
            children: []
        }

        contentData.push(siteObj)
        routeData.push(routeObj)

        this.setState({ contentData: contentData, routeData: routeData })
    }
    handleExplore(dataParam) {
        // this.props.handleRouteData(dataParam)
        let { routeData } = this.state
        let filteredSelectedHomeCardRoute = routeData.length > 0 && routeData.filter(route => route.id === dataParam.id)[0]

        this.props.history.push({
            pathname: `/${dataParam.id}`,
            state: { showBackBtn: true, fromPath: window.location.pathname },
        })
        this.setState({
            selectedHomeCardRoute: filteredSelectedHomeCardRoute,
            selectedHomeCard: dataParam, level: 1
        })
    }
    handleLevelCount(levelParam) {
        this.setState({ level: levelParam })
    }
    searchCards(data) {

        if ((data.type === "site") && (data.title.toLowerCase().includes(this.state.searchText.toLowerCase()))) {
            return true
        }
        return false
    }

    render() {
        const { isLoading, contentData, routeData, level, searchText, selectedHomeCard, selectedHomeCardRoute } = this.state;
        // console.log("contentData", contentData)
        // console.log("homeroute", routeData)
        // console.log("selectedHomeCard", selectedHomeCard)
        // console.log("selectedHomeCardRoute", selectedHomeCardRoute)
        const renderMenuComponents = selectedHomeCardRoute.component &&
            <Route
                path={selectedHomeCardRoute.to}
                exact={selectedHomeCardRoute.exact}
                name={selectedHomeCardRoute.label}
                render={props => <selectedHomeCardRoute.component {...props}
                    levelCount={this.handleLevelCount.bind(this)}
                    routeData={routeData}
                    contentData={contentData}
                    selectedHomeCardData={selectedHomeCard}
                    selectedHomeCardRouteData={selectedHomeCardRoute}
                />}
            />
        return (
            <div className="home-component" >
                {isLoading &&
                    <Card className="spinner-card mt-1">
                        <CardBody className="text-center">
                            <Spinner color="secondary" />
                        </CardBody>
                    </Card>
                }
                {
                    (!isLoading && level === 0) &&
                    <React.Fragment>
                        <Row className="m-0 py-2">
                            <Col><h5 className="m-0">Mind Space</h5></Col>
                            <Col className="text-right">
                                {contentData.length > 0 &&
                                    <input type="text" value={searchText} onChange={(e) => this.setState({ searchText: e.target.value })} placeholder="Search in Results" className="search-box mr-3" />
                                }
                                <i className="fa fa-plus add-icon text-primary" onClick={() => this.addHomeCard()} />
                            </Col>
                        </Row>
                        {contentData.length > 0 &&
                            <React.Fragment>
                                <Row className="m-0" xs="1" md="3">
                                    {contentData.map((data, dataIdx) =>
                                        this.searchCards(data) &&
                                        data.type === "site" &&
                                        <Col key={dataIdx} className="py-3">
                                            <Card className="home-card">
                                                <CardBody>
                                                    <Row xs="1" md="1">
                                                        <Col>
                                                            <span className="m-0 text-muted float-right">{data.createdAt}</span>
                                                            <h6 className="m-0 data-title">{data.title}</h6>
                                                        </Col>
                                                        <Col>
                                                            <small>{data.id}</small>
                                                            <p className="m-0 data-description">{data.description}</p>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                                <CardFooter>
                                                    <Row className="m-0">
                                                        <Col className="p-0 text-right">
                                                            <small className="explore" onClick={() => this.handleExplore(data)}>Explore <i className="fa fa-angle-double-right" /></small>
                                                        </Col>
                                                    </Row>
                                                </CardFooter>
                                            </Card>
                                        </Col>
                                    )}
                                </Row>
                            </React.Fragment>
                        }
                    </React.Fragment>
                }
                {
                    (routeData.length > 0 && level === 1) &&
                    renderMenuComponents
                }
            </div >
        );
    }
}