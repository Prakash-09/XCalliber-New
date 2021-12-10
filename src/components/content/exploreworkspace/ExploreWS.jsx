import React from 'react';
import './ExploreWS.scss';
import { Row, Col } from 'reactstrap';

export default class ExploreWS extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            routeData: this.props?.routeData,
            contentData: this.props?.contentData,
            selectedHomeCardData: this.props?.selectedHomeCardData,
            selectedHomeCardRouteData: this.props?.selectedHomeCardRouteData,
        }
    }
    backToHomeIcon() {
        this.props.levelCount(0)
        this.props.history.push({ pathname: this.props.location.state.fromPath })
    }
    addTopic(topicType) {
        let { contentData, selectedHomeCardData, selectedHomeCardRouteData } = this.state;
        let uid = Math.floor(Math.random() * 0xfffff * new Date().getTime()).toString(16);
        // let filteredRoute = routeData.filter(item => item.id === selectedHomeCardData.id)[0]

        let blockObj = {
            id: "block" + uid,
            title: undefined,
            description: undefined,
            createdAt: undefined,
            type: "block",
            subType: topicType,
            parent: selectedHomeCardData.id,
        }
        contentData.push(blockObj)

        let noOfTopics = topicType === "full" ? 1 : 2

        for (let i = 0; i < noOfTopics; i++) {
            this.buildTopicAndRoute(topicType, i, uid, blockObj.id)
        }
        this.setState({ contentData: contentData, selectedHomeCardRouteData: selectedHomeCardRouteData })
    }
    addExtraTopic(block) {
        let { contentData, selectedHomeCardRouteData } = this.state;
        let uid = Math.floor(Math.random() * 0xfffff * new Date().getTime()).toString(16);

        this.buildTopicAndRoute(block.subType, 0, uid, block.id)

        this.setState({ contentData: contentData, selectedHomeCardRouteData: selectedHomeCardRouteData })
    }
    buildTopicAndRoute(topicType, i, topicId, parentId) {
        let { contentData, selectedHomeCardRouteData } = this.state;

        let topicObj = {
            id: topicType + i + topicId,
            title: "Topic Name",
            description: undefined,
            createdAt: undefined,
            type: "topic",
            parent: parentId,
        }
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
        contentData.push(topicObj)
        selectedHomeCardRouteData.children.push(topicRouteObj)
    }

    render() {
        const { contentData, selectedHomeCardData, selectedHomeCardRouteData } = this.state;
        // console.log("props", this.props)
        console.log("contentData", contentData)
        console.log("routeData", this.state.routeData)
        // console.log("selectedHomeCardData", selectedHomeCardData)
        // console.log("selectedHomeCardRouteData", selectedHomeCardRouteData)
        return (
            <div className="explorews-component">
                <div className="sideNavbar-container shadow">
                    {this.props?.location?.state?.showBackBtn && <i className="fa fa-arrow-left cursor-pointer" onClick={this.backToHomeIcon.bind(this)} />}
                    <div className="home-nav-item mt-3 mb-1 p-2">
                        <i className={`${selectedHomeCardRouteData.icon} home-nav-item-icon`} /> <span className="home-nav-item-label">{selectedHomeCardRouteData.label}</span>
                    </div>
                    {selectedHomeCardRouteData.children && selectedHomeCardRouteData.children.map((child, childIdx) =>
                        <div key={childIdx} className="topic-nav-item mb-2 px-2 pt-2">
                            <i className={`${child.icon} topic-nav-item-icon`} /> <span className="topic-nav-item-label">{child.label}</span>
                        </div>
                    )}
                </div>
                <div className="content-container py-2 pr-2">
                    <div className="p-1 blocks-container-header">
                        <Row className="m-0">
                            <Col xs="auto">
                                <img src={selectedHomeCardData.conceptImg} alt="concept-logo" height="30px" width="30px" />
                            </Col>
                            <Col className="p-0">
                                <p className="logo-title">{selectedHomeCardData.concept}</p>
                            </Col>
                        </Row>
                    </div>
                    <div className="blocks-container mt-2">
                        <Row className="m-0 pt-4 text-right">
                            <Col>
                                <div className="float-right full-split-container">
                                    <i className="fa fa-columns cursor-pointer my-1 mx-2" onClick={this.addTopic.bind(this, "split")} />
                                    <i className=" fa fa-bars cursor-pointer my-1 mx-2" onClick={this.addTopic.bind(this, "full")} />
                                </div>
                            </Col>
                        </Row>
                        <div>
                            {contentData.map((block, blockIdx) =>
                                ((block.type === "block") && (selectedHomeCardData.id === block.parent)) &&
                                <React.Fragment key={blockIdx}>
                                    <Row className="my-0 mx-2" >
                                        {contentData.map((topic, topicIdx) =>
                                            ((topic.type === "topic") && (block.id === topic.parent)) &&
                                            <Col className="p-2" key={topicIdx}>
                                                <div className="p-3 topic-container">
                                                    <div className="float-right trash-add-subtopic-icons">
                                                        <i className="fa fa-trash fa-xs cursor-pointer" />
                                                        <i className="fa fa-plus fa-xs ml-3 cursor-pointer" />
                                                    </div>
                                                    <h6 className="m-0 data-title">{topic.title}</h6>
                                                </div>
                                            </Col>
                                        )}
                                        {block.subType === "split" && <i className="fa fa-plus add-extra-topic-icon" onClick={this.addExtraTopic.bind(this, block)} />}
                                    </Row>
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}