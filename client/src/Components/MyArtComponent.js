import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import moment from 'moment';
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Col,
    Card,
    CardImg,
    CardTitle,
    CardBody,
    CardImgOverlay,
    Badge,
    CardSubtitle,
    CardText,
    Modal,
    ModalHeader,
    ModalBody
} from 'reactstrap';
import { BrowserRouter, NavLink } from 'react-router-dom';
import Web3 from 'web3';
import { render } from 'react-dom';
import Axios from 'axios';
import './MyArtComponent.css';
import * as aws from 'aws-sdk';
import * as dotenv from 'aws-sdk';
import * as fs from 'fs';
import * as util from 'util';
import loader from '../images/loader.svg';
import annonuser from '../images/user.png';
import Sound from 'react-sound';
import ReactPlayer from 'react-player';
// import { blobToSHA256 } from 'file-to-sha256';
import checkmark from '../images/svg/checkmark.svg';
const SHA256 = require('crypto-js/sha256');

const S3 = require('aws-sdk/clients/s3');
const AWS = require('aws-sdk');

const path = require('path');

const BUCKET_NAME = 'superworldapp';

AWS.config.update({
    region: 'us-east-1',
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:f7692b7a-0050-4823-9df7-1ab52e23b6c9'
    })
});
const s3 = new S3();

let allDocs = [];
const ETHER = 1000000000000000000;

const cardpills = [
    {
        title: 'Ready For Sale',
        class: 'class1'
    },
    {
        title: 'Listing For Sale',
        class: 'class2'
    },
    {
        title: 'Biding',
        class: 'class2'
    },
    {
        title: 'Auction Ongoing',
        class: 'class2'
    },
    {
        title: 'Owned by',
        class: 'class3'
    }
];

class Allpatrender extends Component {
    // let day = moment.unix(art.dateofComp);
    // let xy = art.dateofComp;
    // let date = new Date(xy*1000);
    // let time = day.format('dddd MMMM Do YYYY, h:mm:ss a');
    // let yz = xy != 0?"bg-success text-white":"";
    constructor(props) {
        super(props);
        this.state = {
            docCount: 0,
            art: [],
            isModalOpen: false,
            sellPrice: 0,
            auctionLoading: false,
            putForSaleLoading: false,
            delistLoading: false,
            listForAuctionSuccess: false,
            listForSaleSuccess: false,
            endAuctionLoading: false,
            endAuctionSuccess: false,
            soundPlaying: false
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.toggleListForAuction = this.toggleListForAuction.bind(this);
        this.toggleListForSale = this.toggleListForSale.bind(this);
        this.toggleEndAuction = this.toggleEndAuction.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.buyItem = this.buyItem.bind(this);
        this.putForSale = this.putForSale.bind(this);
        this.DeSale = this.DeSale.bind(this);
        this.StartAuction = this.StartAuction.bind(this);
        this.EndAuction = this.EndAuction.bind(this);
        //this.toggleAuction = this.toggleAuction.bind(this);
    }
    buyItem = async () => {
        const res = await this.props.contract.methods
            .buyToken(this.props.art.tokenIdentifier)
            .send({
                from: this.props.accounts,
                value: this.props.art.tokenSellPrice,
                gas: 10000000
            });
        console.log(res);
    };
    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }
    toggleAuction() {
        this.setState({
            isModalAucOpen: !this.state.isModalAucOpen
        });
    }

    toggleListForAuction() {
        this.setState({
            listForAuctionSuccess: !this.state.listForAuctionSuccess
        });
    }

    toggleListForSale() {
        this.setState({ listForSaleSuccess: !this.state.listForSaleSuccess });
    }

    toggleEndAuction() {
        this.setState({ endAuctionSuccess: !this.state.endAuctionSuccess });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }
    putForSale = async () => {
        this.setState({ putForSaleLoading: true });
        const res = await this.props.contract.methods
            .putForSale(
                this.props.art.tokenIdentifier,
                (this.state.sellPrice * ETHER).toString()
            )
            .send({ from: this.props.accounts, gas: 1000000 });
        this.setState({ putForSaleLoading: false, listForSaleSuccess: true });
        this.toggleModal();
        window.location.reload();
        console.log(res);
    };
    DeSale = async () => {
        this.setState({ delistLoading: true });
        const res = await this.props.contract.methods
            .deSale(this.props.art.tokenIdentifier)
            .send({ from: this.props.accounts, gas: 1000000 });
        this.setState({ delistLoading: false });
        window.location.reload();
        console.log(res);
    };
    StartAuction = async () => {
        this.setState({ auctionLoading: true });
        const res = await this.props.contract.methods
            .startbid(this.props.art.tokenIdentifier)
            .send({ from: this.props.accounts, gas: 1000000 });
        this.setState({ auctionLoading: false, listForAuctionSuccess: true });
        window.location.reload();
        console.log(res);
    };
    EndAuction = async () => {
        this.setState({ endAuctionLoading: true });
        const res = await this.props.contract.methods
            .closeBidOwner(this.props.art.tokenIdentifier)
            .send({ from: this.props.accounts, gas: 7000000 });
        this.setState({ endAuctionLoading: false, endAuctionSuccess: true });
        window.location.reload();
        console.log(res);
    };
    AddBid = async () => {
        const res = await this.props.contract.methods
            .addBid(this.props.art.tokenIdentifier)
            .send({ from: this.props.accounts, gas: 1000000, value: 1000000 });
        // window.location.reload();
        console.log(res);
    };
    CloseBid = async () => {
        const res = await this.props.contract.methods
            .closBid(this.props.art.tokenIdentifier)
            .send({ from: this.props.accounts, gas: 7000000 });
        console.log(res);
    };
    render() {
        let but = this.props.art.isSelling ? ' ' : 'hidden';
        let bak = this.props.art.isSelling ? 'bg-success text-white' : '';
        let buk = this.props.art.auction.isBidding ? 'bg-warning' : '';
        let b = this.props.art.isSelling ? 'hidden' : 'abtn';
        let b1 = this.props.art.isSelling ? 'hidden' : 'abtn1';
        let but1 = this.props.art.isSelling ? 'abtn1' : 'hidden';
        let auc1 = this.props.art.auction.isBidding ? 'hidden' : 'abtn';
        let auc2 = this.props.art.auction.isBidding ? 'hidden' : 'abtn1';
        let forAuc = this.props.art.auction.isBidding ? 'visible' : 'invisible';
        console.log(this.props.art.imgUrl);
        let pr =
            Web3.utils.fromWei(
                this.props.art.tokenSellPrice.toString(),
                'ether'
            ) == 0
                ? 'invisible'
                : 'visible';
        let reSellOrSell = this.props.art.isSelling;
        let Auc = this.props.art.auction.isBidding;
        let accNum = this.props.art.tokenCreator;

        const accUsername = () => {
            if (accNum === '0xB4C33fFc72AF371ECaDcF72673D5644B24946256')
                return '@Chitra';
            else if (accNum === '0x0d5567345D3Cb1114471BC07c396Cc32C7CF92ec')
                return '@Arianna';
            else if (accNum === '0xABD82c9B735F2C89f2e62152A9884F4A92414F20')
                return '@CJMain';
            else if (accNum === '0x63611F92FA2d7B7e6625a97E6474b7fA16DbD89F')
                return '@CJ Test';
            else if (accNum === '0x4271AC6Bb565D120e2Ac1C3fb855aE5Dad6aE8ff')
                return '@Swapnil';
            else if (accNum === '0x81B2362F55Ea93f71990d7F446dca80BdD94C6e7')
                return '@SwapnilTest';
            else return '@Annonymous';
        };

        const displayFileType = () => {
            if (/\.(jpe?g|png|gif|bmp)$/i.test(this.props.art.imgurl)) {
                return (
                    <CardImg
                        className={orientation}
                        top
                        src={this.props.art.imgurl}
                        alt='Card image'></CardImg>
                );
            } else if (/\.(?:wav|mp3)$/i.test(this.props.art.imgurl)) {
                return (
                    <>
                        <button
                            style={{
                                zIndex: '1'
                            }}
                            onClick={() =>
                                this.setState({
                                    soundPlaying: !this.state.soundPlaying
                                })
                            }>
                            {this.state.soundPlaying ? 'Pause' : 'Play'}
                        </button>
                        <Sound
                            url={this.props.art.imgurl}
                            playStatus={
                                this.state.soundPlaying
                                    ? Sound.status.PLAYING
                                    : ''
                            }
                            playFromPosition={300 /* in milliseconds */}
                            onLoading={this.handleSongLoading}
                            onPlaying={this.handleSongPlaying}
                            onFinishedPlaying={this.handleSongFinishedPlaying}
                        />
                    </>
                );
            } else if (
                /\.(?:mov|avi|wmv|flv|3pg|mp4|mpg)$/i.test(
                    this.props.art.imgurl
                )
            ) {
                return (
                    <ReactPlayer
                        width={'270px'}
                        loop={true}
                        playing={true}
                        url={this.props.art.imgurl}
                    />
                );
            }
        };

        const colorpills = () => {
            if (this.props.art.isSelling) return cardpills[1];
            else if (this.props.art.auction.isBidding) return cardpills[3];
            else return cardpills[0];
        };
        let x = colorpills();

        const img = new Image();
        let orientation;
        img.onload = function () {
            let width = this.width;
            let height = this.height;
            orientation = width < height ? 'portrait' : 'landscape';
        };
        img.src = this.props.art.imgurl;
        img.onload();

        return (
            // <div>
            // {cardpills.map((item) => {
            //   return (
            <Card
                className={this.props.art.auction.isBidding ? buk : bak}
                className='card-artcard'>
                {/* <a href={this.props.art.imgurl} target='_blank'> */}
                <div className='card-img-top-all-art'>
                    {/* <CardImg
                            className={orientation}
                            top
                            src={this.props.art.imgurl}
                            alt='Card image'></CardImg> */}
                    {displayFileType()}
                    <Link to={`/card/${this.props.art.tokenIdentifier}`}>
                        <CardImgOverlay style={{ width: '100%' }}>
                            <Badge pill className={x.class}>
                                {x.title}
                            </Badge>
                        </CardImgOverlay>
                    </Link>
                </div>

                <CardBody className='all-art-body'>
                    <div>
                        <div
                            style={{
                                display: 'flex'
                                // justifyContent: 'flex-start',
                            }}>
                            <CardSubtitle>
                                <img
                                    style={{ marginRight: '30px' }}
                                    width='16px'
                                    height='16px'
                                    className='rounded-circle'
                                    src={annonuser}></img>
                            </CardSubtitle>
                            <CardSubtitle
                                style={{
                                    fontFamily: 'Gibson',
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    color: '#888888',
                                    display: 'flex',
                                    alignItems: 'flex-end'
                                }}>
                                {' '}
                                Created by{' '}
                                <div className='token-creator'>
                                    {accUsername()}{' '}
                                </div>
                            </CardSubtitle>
                        </div>

                        {/* <CardTitle className="ctext">
                        Item Title : {this.props.art.tokenTitle} {this.props.art.tokenCreator}
                    </CardTitle> */}
                        <div className='ctext'>
                            <CardText
                                style={{
                                    position: 'relative',
                                    fontFamily: 'Gibson',
                                    fontSize: '13px',
                                    color: '#B3B3B3',
                                    fontWeight: 'bold'
                                }}>
                                {' '}
                                Title
                            </CardText>
                            <CardText
                                style={{
                                    position: 'relative',
                                    fontFamily: 'Gibson',
                                    fontSize: '13px',
                                    color: '#B3B3B3',
                                    fontWeight: 'bold'
                                }}>
                                Price
                            </CardText>
                        </div>
                        <div className='ctext' style={{ height: '2rem' }}>
                            <CardText
                                style={{
                                    position: 'relative',
                                    fontFamily: 'Gibson',
                                    fontSize: '13px',
                                    color: 'black',
                                    textDecoration: 'none'
                                }}>
                                {this.props.art.tokenTitle}
                            </CardText>
                            <CardText
                                style={{
                                    position: 'relative',
                                    fontFamily: 'Gibson',
                                    fontSize: '13px',
                                    color: 'black',
                                    textDecoration: 'none'
                                }}>
                                {Web3.utils.fromWei(
                                    this.props.art.tokenSellPrice.toString(),
                                    'ether'
                                )}{' '}
                                ETH
                            </CardText>
                        </div>
                        {/* <CardText>
                        <small>
                            Item Creator : {this.props.art.tokenCreator}
                        </small>
                    </CardText>
                    <CardText className={pr}>
                        <small>
                            Item Sell Price :{' '}
                            {Web3.utils.fromWei(
                                this.props.art.tokenSellPrice.toString(),
                                'ether'
                            )}{' '}
                            ETH
                        </small>
                    </CardText> */}
                    </div>
                    <div
                        className='ctext'
                        style={{
                            padding: '0px',
                            height: '2rem',
                            marginTop: '5%'
                        }}>
                        {reSellOrSell ? (
                            <button
                                className={auc2}
                                //className='abtn' style ={{ color :'white', backgroundColor:"#5540C7"}}
                                // color='primary'
                                onClick={this.toggleModal}>
                                Relist
                            </button>
                        ) : (
                            <button
                                className={auc1}
                                //className='abtn' style ={{ color :'white', backgroundColor:"#5540C7"}}
                                // color='primary'
                                onClick={this.toggleModal}>
                                Sell
                            </button>
                        )}
                        {/* <button
              className={auc1}
              //className='abtn' style ={{ color :'white', backgroundColor:"#5540C7"}}
              // color='primary'
              onClick={this.toggleModal}
            >
              {reSellOrSell}
            </button> */}
                        <button
                            className={but1}
                            //className='abtn'
                            type='submit'
                            onClick={this.DeSale}>
                            Delist
                        </button>
                        {forAuc === 'visible' ? (
                            <button
                                style={{
                                    color: 'white',
                                    border: 'none',
                                    backgroundColor: 'white'
                                }}>
                                but
                            </button>
                        ) : (
                            <div></div>
                        )}
                        {Auc ? (
                            <button
                                className={b1}
                                //className={auc1}
                                //className='abtn'
                                type='submit'
                                // color='primary'
                                onClick={
                                    this.props.art.auction.isBidding
                                        ? this.EndAuction
                                        : this.StartAuction
                                }
                                //onClick = {this.toggleAuction}
                            >
                                End Auction
                            </button>
                        ) : (
                            <button
                                className={b}
                                //className={auc1}
                                //className='abtn'
                                type='submit'
                                // color='primary'
                                onClick={
                                    this.props.art.auction.isBidding
                                        ? this.EndAuction
                                        : this.StartAuction
                                }
                                //onClick = {this.toggleAuction}
                            >
                                Auction
                            </button>
                        )}

                        {/* <button
              className={b}
              //className={auc1}
              //className='abtn'
              type='submit'
              // color='primary'
              onClick={
                this.props.art.auction.isBidding
                  ? this.EndAuction
                  : this.StartAuction
              }
              //onClick = {this.toggleAuction}
            >
              {Auc}
            </button> */}
                        {this.state.endAuctionLoading ? (
                            <img src={loader} />
                        ) : (
                            <div></div>
                        )}
                        {forAuc === 'visible' ? (
                            <button
                                style={{
                                    color: 'white',
                                    border: 'none',
                                    backgroundColor: 'white'
                                }}>
                                but
                            </button>
                        ) : (
                            <div></div>
                        )}

                        <Modal
                            isOpen={this.state.isModalOpen}
                            toggle={this.toggleModal}
                            className='modal_popup'>
                            <ModalHeader
                                toggle={this.toggleModal}
                                className='pl-5'>
                                Put For Sale
                            </ModalHeader>
                            <Card className='artCard' style={{ height: '50%' }}>
                                <CardImg
                                    top
                                    className='displayImage'
                                    src={this.props.art.imgurl}
                                    alt='Card image'
                                />
                                <CardBody>
                                    <div
                                        className='ctext'
                                        style={{ padding: '2px' }}>
                                        <CardSubtitle
                                            style={{
                                                position: 'relative',
                                                fontFamily: 'Gibson',
                                                fontSize: '15px',
                                                color: '#B3B3B3'
                                            }}>
                                            Title
                                        </CardSubtitle>
                                        <CardSubtitle
                                            style={{
                                                position: 'relative',
                                                fontFamily: 'Gibson',
                                                fontSize: '15px',
                                                color: '#B3B3B3'
                                            }}>
                                            Price
                                        </CardSubtitle>
                                    </div>
                                    <div
                                        className='ctext'
                                        style={{ padding: '2px' }}>
                                        <CardText
                                            style={{
                                                position: 'relative',
                                                fontFamily: 'Gibson',
                                                fontSize: '15px',
                                                color: 'black'
                                            }}>
                                            {this.props.art.tokenTitle}
                                        </CardText>
                                        <CardText
                                            style={{
                                                position: 'relative',
                                                fontFamily: 'Gibson',
                                                fontSize: '15px',
                                                color: 'black'
                                            }}>
                                            {Web3.utils.fromWei(
                                                this.props.art.tokenSellPrice.toString(),
                                                'ether'
                                            )}{' '}
                                            ETH
                                        </CardText>
                                    </div>
                                    <div className='ctext1'>
                                        <p
                                            style={{
                                                position: 'relative',
                                                fontFamily: 'Gibson',
                                                fontSize: '15px',
                                                color: 'black',
                                                marginTop: '2%'
                                            }}>
                                            Sell Price :{' '}
                                        </p>
                                        <p>
                                            {' '}
                                            <Input
                                                type='text'
                                                id='sellPrice'
                                                name='sellPrice'
                                                onChange={
                                                    this.handleInputChange
                                                }></Input>
                                        </p>
                                    </div>
                                    <div>
                                        <div>
                                            <button
                                                className='abtn'
                                                style={{
                                                    left: '32%',
                                                    color: 'white',
                                                    backgroundColor: '#5540C7'
                                                }}
                                                type='submit'
                                                onClick={this.putForSale}>
                                                Confirm
                                            </button>{' '}
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'flex-end'
                                            }}>
                                            {this.state.putForSaleLoading ? (
                                                <img src={loader} />
                                            ) : (
                                                <div></div>
                                            )}
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Modal>

                        {/* LIST FOR AUCTION MODAL */}
                        <Modal
                            isOpen={this.state.listForAuctionSuccess}
                            toggle={this.toggleListForAuction}
                            className='modal-xl'>
                            <ModalHeader toggle={this.toggleListForAuction}>
                                <div></div>
                            </ModalHeader>
                            <ModalBody
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    font: 'Gibson',
                                    height: '20rem',
                                    paddingBottom: '5rem'
                                }}>
                                <p
                                    style={{
                                        textAlign: 'center',
                                        fontSize: '1.25rem',
                                        fontWeight: '450',
                                        marginTop: '1rem'
                                    }}>
                                    Congratulations!
                                </p>
                                <img src={checkmark} />
                                <p
                                    style={{
                                        textAlign: 'center',
                                        color: 'gray',
                                        fontSize: '12px'
                                    }}>
                                    Your item has been listed for auction in the
                                    marketplace!
                                </p>
                                <button
                                    className='upload-more-btn'
                                    onClick={this.toggleListForAuction}>
                                    BACK TO MY COLLECTIONS
                                </button>
                            </ModalBody>
                        </Modal>

                        {/* LIST FOR SALE MODAL */}
                        <Modal
                            isOpen={this.state.listForSaleSuccess}
                            toggle={this.toggleListForSale}
                            className='modal-xl'>
                            <ModalHeader toggle={this.toggleListForSale}>
                                <div></div>
                            </ModalHeader>
                            <ModalBody
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    font: 'Gibson',
                                    height: '20rem',
                                    paddingBottom: '5rem'
                                }}>
                                <p
                                    style={{
                                        textAlign: 'center',
                                        fontSize: '1.25rem',
                                        fontWeight: '450',
                                        marginTop: '1rem'
                                    }}>
                                    Congratulations!
                                </p>
                                <img src={checkmark} />
                                <p
                                    style={{
                                        textAlign: 'center',
                                        color: 'gray',
                                        fontSize: '12px'
                                    }}>
                                    Your item has been listed for sale in the
                                    marketplace!
                                </p>
                                <button
                                    className='upload-more-btn'
                                    onClick={this.toggleListForSale}>
                                    BACK TO MY COLLECTIONS
                                </button>
                            </ModalBody>
                        </Modal>

                        {/* END AUCTION MODAL */}
                        <Modal
                            isOpen={this.state.endAuctionSuccess}
                            toggle={this.toggleEndAuction}
                            className='modal-xl'>
                            <ModalHeader toggle={this.toggleEndAuction}>
                                <div></div>
                            </ModalHeader>
                            <ModalBody
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    font: 'Gibson',
                                    height: '20rem',
                                    paddingBottom: '5rem'
                                }}>
                                <p
                                    style={{
                                        textAlign: 'center',
                                        fontSize: '1.25rem',
                                        fontWeight: '450',
                                        marginTop: '1rem'
                                    }}>
                                    Done!
                                </p>
                                <img src={checkmark} />
                                <p
                                    style={{
                                        textAlign: 'center',
                                        color: 'gray',
                                        fontSize: '12px'
                                    }}>
                                    You have ended the auction for your item.
                                </p>
                                <button
                                    className='upload-more-btn'
                                    onClick={this.toggleListForAuction}>
                                    BACK TO MY COLLECTIONS
                                </button>
                            </ModalBody>
                        </Modal>
                        {/* <Modal
                            isOpen={this.state.isModalAucOpen}
                            toggle={this.toggleAuction}
                            className='modal_popup'>
                            <ModalHeader
                                toggle={this.toggleAuction}
                                className='pl-5'>
                                Start Auction
                            </ModalHeader>
                            <Card className='artCard' style={{height:'50%'}}>
                                <CardImg
                                    top
                                    className="displayImage"
                                    src={this.props.art.imgurl}
                                    alt='Card image'
                                />
                                <CardBody
                                >
                                <div className="ctext" style={{padding:'5px', height:'1rem'}}>
                                    <CardSubtitle style={{
                                        position:'relative',
                                        fontFamily:'Gibson',
                                        fontSize:'15px',
                                        color:'#B3B3B3',

                                    }}>
                                    Title
                                    </CardSubtitle>
                                    <CardSubtitle
                                    style={{
                                        position:'relative',
                                        fontFamily:'Gibson',
                                        fontSize:'15px',
                                        color:'#B3B3B3',
                                    }}
                                    >
                                        Price
                                    </CardSubtitle>
                                </div>
                                <div className="ctext" style={{ padding:'5px'}}>
                                    <CardText
                                    style={{
                                        position:'relative',
                                        fontFamily:'Gibson',
                                        fontSize:'15px',
                                        color:'black',
                                    }}
                                    >
                                        {this.props.art.tokenTitle}
                                    </CardText>
                                    <CardText
                                    style={{
                                        position:'relative',
                                        fontFamily:'Gibson',
                                        fontSize:'15px',
                                        color:'black',
                                    }}
                                    >
                                        {Web3.utils.fromWei(
                                this.props.art.tokenSellPrice.toString(),
                                'ether'
                                )}{' '}
                                ETH
                                    </CardText>
                                </div>
                                <div className="ctext1" style={{ padding:'2px'}}>
                                    <p
                                    style={{
                                        position:'relative',
                                        fontFamily:'Gibson',
                                        fontSize:'15px',
                                        color:'black',
                                        marginTop:'2%'
                                    }}
                                    >Start Bid : </p>
                                    <p>
                                        <Input
                                        style= {{ width:'80%'}}
                                            type='text'
                                            id='bidPrice'
                                            name='bidPrice'
                                            onChange={
                                                this.handleInputChange
                                            }></Input>
                                    </p>
                                    <p
                                    style={{
                                        position:'relative',
                                        fontFamily:'Gibson',
                                        fontSize:'15px',
                                        color:'black',
                                        marginTop:'2%'
                                    }}
                                    > ETH
                                     </p>
                                </div>
                                 <div className="ctext1">
                                    <p
                                    style={{
                                        position:'relative',
                                        fontFamily:'Gibson',
                                        fontSize:'15px',
                                        color:'black',
                                        marginTop:'2%'
                                    }}
                                    >Duration : </p>
                                    <p>

                                        <Input
                                        style= {{ width:'80%'}}
                                            type='text'
                                            id='bidPrice'
                                            name='bidPrice'
                                            onChange={
                                                this.handleInputChange
                                            }></Input>
                                    </p>
                                    <p
                                    style={{
                                        position:'relative',
                                        fontFamily:'Gibson',
                                        fontSize:'15px',
                                        color:'black',
                                        marginTop:'2%'
                                    }}
                                    >Days </p>
                                </div>
                                <div>
                                <button
                                    className="abtn" style={{
                                        left:'32%', color: 'white', backgroundColor:'#5540C7'
                                    }}
                                        type='submit'
                                        onClick={this.putForSale}>
                                        Confirm
                                    </button>{' '}
                                </div>
                                </CardBody>
                            </Card>
                        </Modal>  */}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {this.state.delistLoading ? (
                            <img height='35' src={loader} />
                        ) : (
                            <div></div>
                        )}
                        {this.state.auctionLoading ? (
                            <img height='35' src={loader} />
                        ) : (
                            <div></div>
                        )}
                    </div>
                </CardBody>
            </Card>
        );
    }
}

class MyItemComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            docCount: 0,
            art: [],
            cust: [],
            manuf: [],
            isModalOpen1: false,
            title: '',
            artUrl: '',
            price: '',
            artHash: '',
            nos: 0,
            isLoading: false,
            loadingError: false,
            uploadSuccess: false
        };
        this.toggleModal1 = this.toggleModal1.bind(this);
        this.toggleModal2 = this.toggleModal2.bind(this);
        this.handleUploadMore = this.handleUploadMore.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.fileSelectHandler = this.fileSelectHandler.bind(this);
        this.fileUploadHandler = this.fileUploadHandler.bind(this);
        this.fileAwsHandler = this.fileAwsHandler.bind(this);
    }

    toggleModal1() {
        this.setState({
            isModalOpen1: !this.state.isModalOpen1
        });
    }

    toggleModal2() {
        this.setState({
            uploadSuccess: !this.state.uploadSuccess
        });
    }

    handleUploadMore() {
        this.toggleModal2();
        this.toggleModal1();
    }
    creatingItems = async (x) => {
        let tokenHash = this.state.artHash.toString();
        let tokenTitle = this.state.title;
        let tokenPrice = (this.state.price * ETHER).toString();
        let imgUrl = x;
        let nos = this.state.nos;
        console.log(tokenHash, tokenTitle, tokenPrice, imgUrl, nos);

        try {
            const res = await this.props.contract.methods
                .batchCreator(
                    tokenHash,
                    tokenTitle,
                    (this.state.price * ETHER).toString(),
                    imgUrl,
                    nos
                )
                .send({ from: this.props.accounts, gas: 5000000 });

            console.log('res', res);
            let data;

            if (Array.isArray(res.events.tokencreated)) {
                data = await res.events.tokencreated.map((token) =>
                    Axios.post(
                        `http://geo.superworldapp.com/api/json/token/add`,
                        {
                            tokenId: token.returnValues.tokenId.toString(),
                            description: 'A unique piece of art',
                            image: imgUrl,
                            name: tokenTitle,
                            blockchain: 'e',
                            networkId: 4,
                            price: tokenPrice
                        }
                    )
                );
            } else {
                data = await Axios.post(
                    `http://geo.superworldapp.com/api/json/token/add`,
                    {
                        tokenId: res.events.tokencreated.returnValues.tokenId.toString(),
                        description: 'A unique piece of art',
                        image: imgUrl,
                        name: tokenTitle,
                        blockchain: 'e',
                        networkId: 4,
                        price: tokenPrice
                    }
                );
            }

            console.log('data', data);
            this.toggleModal1();
            window.location.reload();
            this.setState({ isLoading: false, uploadSuccess: true });
        } catch (err) {
            this.setState({ loadingError: true });
            console.error(err.message);
        }
        this.setState({ isLoading: false });
    };

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    async componentDidMount() {
        let res = await this.props.contract?.methods.tokenCount().call();
        console.log(res);

        let response = [];
        let createrToken = [];
        for (let i = 1; i <= res; i++) {
            let rex = await this.props.contract?.methods.Arts(i).call();
            if (rex.tokenOwner == this.props.accounts) {
                response.push(rex);
            } else if (rex.tokenCreator == this.props.accounts) {
                createrToken.push(rex);
            }
        }
        console.log(createrToken);
        allDocs = [];
        allDocs = response;
        console.log(response);
        this.setState({ art: allDocs });
    }
    fileSelectHandler = (event) => {
        console.log(event.target.files);
        this.setState({
            selectedFile: event.target.files[0]
        });
    };
    fileUploadHandler = async (event) => {
        event.preventDefault();
        // const hash = await blobToSHA256(this.state.selectedFile);
        let hash = '';
        this.setState({ isLoading: true, loadingError: false, artHash: hash });
        this.fileAwsHandler(this.state.selectedFile, this.creatingItems);
    };

    fileAwsHandler = async (file, callback) => {
        console.log(file);
        let newfilename = `image_${Date.now()}${path
            .extname(file.name)
            .toLowerCase()}`;
        console.log(newfilename);
        let params = {
            ACL: 'public-read',
            Bucket: BUCKET_NAME,
            Key: 'marketplace/' + newfilename,
            ContentType: file.type,
            Body: file
        };

        s3.putObject(params, function (err, data) {
            if (err) {
                console.log('error :', err);
            } else {
                callback(
                    `https://superworldapp.s3.amazonaws.com/marketplace/${newfilename}`
                );
            }
        });
    };

    render() {
        const Menu = this.state.art.map((x) => {
            return (
                <div key={x.tokenIdentifier} className='col-4 col-md-3'>
                    <Allpatrender
                        art={x}
                        contract={this.props.contract}
                        accounts={this.props.accounts}
                    />
                    <br />
                    <br />
                </div>
            );
        });

        let ch = 'visible';
        return (
            <div className='artContainer'>
                <div
                    style={{
                        marginLeft: '2px'
                    }}>
                    <p
                        style={{
                            fontFamily: 'Gibson',
                            fontSize: '30px',
                            fontWeight: 'bold',
                            marginTop: '10px',
                            textAlign: 'left'
                        }}>
                        My Collections
                    </p>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                        <p style={{ marginLeft: '2px', position: 'relative' }}>
                            <button className='abtn'>All</button>
                            <button className='abtn'>Offer Made </button>
                            <button className='abtn'>Offer Received </button>
                            <button className='abtn'>My Creations </button>
                        </p>
                        <p style={{ marginLeft: '2px', position: 'relative' }}>
                            <Button
                                className='abtn'
                                style={{
                                    backgroundColor: '#5548C7',
                                    color: 'white'
                                }}
                                onClick={this.toggleModal1}>
                                + {''}UPLOAD
                            </Button>
                        </p>
                    </div>
                </div>

                <Modal
                    isOpen={this.state.isModalOpen1}
                    toggle={this.toggleModal1}
                    className='modal-xl'>
                    <ModalHeader toggle={this.toggleModal1}>
                        <p
                            style={{
                                fontFamily: 'Gibson',
                                fontSize: '25px',
                                fontWeight: '800',
                                marginTop: '10px',
                                textAlign: 'left',
                                marginLeft: '7px',
                                textTransform: 'uppercase'
                            }}>
                            Add New Artwork
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        <Form>
                            <div className='row pl-5 pr-5'>
                                <div className='col-6'>
                                    <FormGroup>
                                        <Label
                                            htmlFor='title'
                                            className='ml-3'
                                            style={{
                                                fontFamily: 'Gibson',
                                                fontSize: '20px',
                                                color: 'black'
                                            }}>
                                            {' '}
                                            Title
                                        </Label>
                                        <Input
                                            type='text'
                                            id='title'
                                            name='title'
                                            onChange={this.handleInputChange}
                                        />
                                    </FormGroup>
                                </div>
                                <div
                                    className='col-6'
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                    <FormGroup>
                                        <Label
                                            htmlFor='price'
                                            className='ml-3'
                                            style={{
                                                fontFamily: 'Gibson',
                                                fontSize: '20px',
                                                color: 'black'
                                            }}>
                                            {' '}
                                            Sell Price
                                        </Label>
                                        <Input
                                            style={{ width: '50%' }}
                                            type='text'
                                            id='price'
                                            name='price'
                                            onChange={this.handleInputChange}
                                        />
                                        <Label
                                            className='ml-3'
                                            style={{
                                                fontFamily: 'Gibson',
                                                fontSize: '20px',
                                                color: 'black'
                                            }}>
                                            {' '}
                                            ETH
                                        </Label>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className='row pl-5 pr-5'>
                                <div className='col-6'>
                                    <FormGroup>
                                        <Label
                                            htmlFor='nos'
                                            className='ml-3'
                                            style={{
                                                fontFamily: 'Gibson',
                                                fontSize: '20px',
                                                color: 'black'
                                            }}>
                                            No. of Tokens
                                        </Label>
                                        <Input
                                            style={{ width: '30%' }}
                                            type='number'
                                            id='nos'
                                            name='nos'
                                            onChange={this.handleInputChange}
                                        />
                                    </FormGroup>
                                </div>
                                <div className='col-6'>
                                    <FormGroup>
                                        <Label
                                            htmlFor='artHash'
                                            className='ml-4'
                                            style={{
                                                fontFamily: 'Gibson',
                                                fontSize: '20px',
                                                color: 'black'
                                            }}>
                                            Art
                                        </Label>
                                        <Input
                                            style={{ marginLeft: '1.0rem' }}
                                            type='file'
                                            onChange={this.fileSelectHandler}
                                        />
                                    </FormGroup>
                                </div>
                            </div>
                            <br />
                            <button
                                className='abtn'
                                style={{
                                    float: 'right',
                                    color: 'white',
                                    backgroundColor: '#5548C7',
                                    fontSize: '18px'
                                }}
                                color='primary'
                                onClick={this.fileUploadHandler}>
                                Add
                            </button>
                            {this.state.isLoading ? (
                                <img src={loader} />
                            ) : (
                                <div></div>
                            )}
                            {this.state.loadingError ? (
                                <div
                                    style={{
                                        color: 'red',
                                        fontFamily: 'Gibson'
                                    }}>
                                    There was a transaction/processing error.
                                    Please try again.
                                </div>
                            ) : (
                                <div></div>
                            )}
                            <br />
                        </Form>
                    </ModalBody>
                </Modal>

                {/* UPLOAD SUCCESS MODAL */}
                <Modal
                    isOpen={this.state.uploadSuccess}
                    toggle={this.toggleModal2}
                    className='modal-xl'>
                    <ModalHeader toggle={this.toggleModal2}>
                        <div></div>
                    </ModalHeader>
                    <ModalBody
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            font: 'Gibson',
                            height: '20rem',
                            paddingBottom: '5rem'
                        }}>
                        <img src={checkmark} />
                        <p
                            style={{
                                textAlign: 'center',
                                fontSize: '1.25rem',
                                fontWeight: '450',
                                marginTop: '1rem'
                            }}>
                            Hi, your upload was successful!
                        </p>
                        <p
                            style={{
                                textAlign: 'center',
                                color: 'gray',
                                fontSize: '12px'
                            }}>
                            You can view your recent uploaded file under “MY
                            COLLECTIONS”
                        </p>
                        <button
                            className='upload-more-btn'
                            onClick={this.handleUploadMore}>
                            Upload More
                        </button>
                    </ModalBody>
                </Modal>

                <div className='row'>{Menu}</div>

                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />

                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
            </div>
        );
    }
}

export default MyItemComponent;
