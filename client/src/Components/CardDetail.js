import React, { useEffect, useState } from 'react';
import TableBody from './TableBody';
import { Link } from 'react-router-dom';
import {
    Card,
    CardBody,
    CardSubtitle,
    CardText,
    CardImg,
    CardHeader,
    Table,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import Sound from 'react-sound';
import ReactPlayer from 'react-player';
import loader from '../images/loader.svg';
import image3 from '../images/image 6.png';
import image4 from '../images/image 23.png';
import image5 from '../images/image 25.png';
import image6 from '../images/image 28.png';
import image7 from '../images/image 29.png';
import annonuser from '../images/user.png';
import checkmark from '../images/svg/checkmark.svg';
import Web3 from 'web3';
import Axios from 'axios';

const CardDetail = ({
    art,
    accounts,
    contract,
    cre,
    matchId,
    handleSongPlaying,
    handleSongLoading,
    handleSongFinishedPlaying
}) => {
    console.log(art);

    const [ethPrice, setEthPrice] = useState({});
    const [creValue, setCreValue] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [handleInput, setHandleInput] = useState('');
    const [pay, setPay] = useState(0);
    const [loadingPurchase, setLoadingPurchase] = useState(false);
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);
    const [loadingPlaceBid, setLoadingPlaceBid] = useState(false);
    const [bidSuccess, setBidSuccess] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownValue, setDropdownValue] = useState('');
    const [soundPlaying, setSoundPlaying] = useState(false);

    const changeValue = (e) => {
        setDropdownValue(e.currentTarget.textContent);
    };

    const toggle = () => setDropdownOpen((prevState) => !prevState);

    const ETHER = 1000000000000000000;

    const accUsername = (accNum) => {
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

    const getEthDollarPrice = () => {
        try {
            Axios.get(
                `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,btc,eur,gpb&include_24hr_change=false`
            ).then((res) => {
                // console.log(typeof res.data.ethereum.usd_24h_change);
                setEthPrice(res.data.ethereum);
            });
        } catch {
            console.log('could not get the request');
        }
        // return <span>{ethPrice.usd}</span>;
    };

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setHandleInput(value);
        console.log(handleInput);
    };

    const AddBid = async () => {
        setLoadingPlaceBid(true);
        const res = await contract.methods.addBid(art.tokenIdentifier).send({
            from: accounts,
            gas: 1000000,
            value: (handleInput * ETHER).toString()
        });
        setLoadingPlaceBid(false);
        setBidSuccess(true);
        window.location.reload();
        console.log(res);
    };

    const getCreData = async () => {
        let cre = await contract?.getPastEvents('tokencreated', {
            filter: { tokenId: art.tokenIdentifier },
            fromBlock: 7970334
        });
        //  // Using an array means OR: e.g. 20 or 23
        let tb = await contract?.getPastEvents('tokenbought', {
            filter: { tokenId: art.tokenIdentifier },
            fromBlock: 7970334
        });
        let tfs = await contract?.getPastEvents('tokenputforsale', {
            filter: { tokenId: art.tokenIdentifier },
            fromBlock: 7970334
        });
        let tokenBid = await contract?.getPastEvents('tokenbid', {
            filter: { tokenId: art.tokenIdentifier },
            fromBlock: 7970334
        });
        let bidStarted = await contract?.getPastEvents('bidstarted', {
            filter: { tokenId: art.tokenIdentifier },
            fromBlock: 7970334
        });
        for (let property in cre) {
            creValue.push(cre[property]);
        }
        for (let property in tb) {
            creValue.push(tb[property]);
        }
        for (let property in tfs) {
            creValue.push(tfs[property]);
        }
        //if(tokenBid?.length == 0){
        for (let property in tokenBid) {
            creValue.push(tokenBid[property]);
        }
        for (let property in bidStarted) {
            creValue.push(bidStarted[property]);
        }

        creValue.sort((a, b) => {
            return Number(b.returnValues.times) - Number(a.returnValues.times);
        });

        creValue.forEach((item) => {
            let firstChar = item.event.charAt(0).toUpperCase();
            let restOfStr = item.event.slice(1);
            item.event = firstChar + restOfStr;
        });

        console.log(creValue);
    };

    const isToggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const handlePurchase = async () => {
        setLoadingPurchase(true);
        const res = await contract?.methods.buyToken(art.tokenIdentifier).send({
            from: accounts,
            value: art?.tokenSellPrice.toString(),
            gas: 7000000
        });
        setLoadingPurchase(false);
        setPurchaseSuccess(true);
        console.log(res);
    };

    const togglePurchaseSuccess = () => {
        setPurchaseSuccess(!purchaseSuccess);
    };

    const toggleBidSuccess = () => {
        setBidSuccess(!bidSuccess);
    };

    const buyOrSell = () => {
        if (art.isSelling) {
            return (
                <div>
                    <button
                        className='btn btn-primary'
                        onClick={handlePurchase}
                        style={{
                            width: '50%',
                            alignSelf: 'center'
                        }}>
                        Buy Item
                    </button>
                    <div>
                        {loadingPurchase ? <img src={loader} /> : <div></div>}
                    </div>
                </div>
            );
        } else if (art.auction.isBidding) {
            return (
                <React.Fragment>
                    <Input
                        type='text'
                        id='sellPrice'
                        name='sellPrice'
                        style={{ width: '50%', alignSelf: 'center' }}
                        onChange={handleInputChange}></Input>
                    <div>
                        <button
                            className='btn-primary'
                            color='primary'
                            onClick={AddBid}
                            style={{
                                width: '50%',
                                alignSelf: 'center'
                            }}>
                            Place Bid
                        </button>
                        <div>
                            {loadingPlaceBid ? (
                                <img src={loader} />
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>
                    {/* <Modal
                        isOpen={modalOpen}
                        toggle={isToggleModal}
                        className='modal_popup'>
                        <ModalHeader toggle={isToggleModal} className='pl-5'>
                            Start Auction
                        </ModalHeader>
                        <Card className='artCard' style={{ height: '50%' }}>
                            <CardImg
                                top
                                className='displayImage'
                                src={art.imgurl}
                                alt='Card image'
                            />
                            <CardBody>
                                <div
                                    className='ctext'
                                    style={{ padding: '5px', height: '1rem' }}>
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
                                    style={{ padding: '5px' }}>
                                    <CardText
                                        style={{
                                            position: 'relative',
                                            fontFamily: 'Gibson',
                                            fontSize: '15px',
                                            color: 'black'
                                        }}>
                                        {art.tokenTitle}
                                    </CardText>
                                    <CardText
                                        style={{
                                            position: 'relative',
                                            fontFamily: 'Gibson',
                                            fontSize: '15px',
                                            color: 'black'
                                        }}>
                                        {Web3.utils.fromWei(
                                            art.tokenSellPrice.toString(),
                                            'ether'
                                        )}{' '}
                                        ETH
                                    </CardText>
                                </div>
                                <div
                                    className='ctext1'
                                    style={{ padding: '2px' }}>
                                    <p
                                        style={{
                                            position: 'relative',
                                            fontFamily: 'Gibson',
                                            fontSize: '15px',
                                            color: 'black',
                                            marginTop: '2%'
                                        }}>
                                        Start Bid :{' '}
                                    </p>
                                    <p>
                                        <Input
                                            style={{ width: '80%' }}
                                            type='text'
                                            id='bidPrice'
                                            name='bidPrice'></Input>
                                    </p>
                                    <p
                                        style={{
                                            position: 'relative',
                                            fontFamily: 'Gibson',
                                            fontSize: '15px',
                                            color: 'black',
                                            marginTop: '2%'
                                        }}>
                                        {' '}
                                        ETH
                                    </p>
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
                                        Duration :{' '}
                                    </p>
                                    <p>
                                        <Input
                                            style={{ width: '80%' }}
                                            type='text'
                                            id='bidPrice'
                                            name='bidPrice'></Input>
                                    </p>
                                    <p
                                        style={{
                                            position: 'relative',
                                            fontFamily: 'Gibson',
                                            fontSize: '15px',
                                            color: 'black',
                                            marginTop: '2%'
                                        }}>
                                        Days{' '}
                                    </p>
                                </div>
                                <div>
                                    <button
                                        className='abtn'
                                        style={{
                                            left: '32%',
                                            color: 'white',
                                            backgroundColor: '#5540C7'
                                        }}
                                        type='submit'>
                                        Confirm
                                    </button>{' '}
                                </div>
                            </CardBody>
                        </Card>
                    </Modal> */}
                </React.Fragment>
            );
        }
    };

    const displayFileType = () => {
        if (/\.(jpe?g|png|gif|bmp)$/i.test(art?.imgurl)) {
            return (
                <a href={art?.imgurl} target='_blank'>
                    <img src={art?.imgurl} className='card-img' alt='...' />
                </a>
            );
        } else if (/\.(?:wav|mp3)$/i.test(art?.imgurl)) {
            return (
                <>
                    <button
                        style={{
                            zIndex: '1'
                        }}
                        onClick={() => setSoundPlaying(!soundPlaying)}>
                        {soundPlaying ? 'Pause' : 'Play'}
                    </button>
                    <Sound
                        url={art?.imgurl}
                        playStatus={soundPlaying ? Sound.status.PLAYING : ''}
                        playFromPosition={300 /* in milliseconds */}
                        onLoading={handleSongLoading}
                        onPlaying={handleSongPlaying}
                        onFinishedPlaying={handleSongFinishedPlaying}
                    />
                </>
            );
        } else if (/\.(?:mov|avi|wmv|flv|3pg|mp4|mpg)$/i.test(art?.imgurl)) {
            return (<a href={art?.imgurl} target='_blank'><ReactPlayer loop={true} playing={true} url={art?.imgurl} /></a>);
        }
    };

    useEffect(() => {
        getCreData();
        getEthDollarPrice();
        // console.log(matchId)
        // console.log('Header', myProperties);
    }, []);

    //   const buyItem = async () => {
    //         const res = await contract.methods
    //             .buyToken(art.tokenIdentifier)
    //             .send({
    //                 from: accounts,
    //                 value: art.tokenSellPrice,
    //                 gas: 1000000
    //             });
    //         console.log(res);
    //     };
    console.log(ethPrice);
    return (
        <>
            <div className='container'>
                <div className='d-flex justify-content-between mt-5 py-5'>
                    <div
                        className='card'
                        style={{
                            width: '50%'
                        }}>
                        {displayFileType()}
                    </div>
                    <div className='information d-flex flex-column'>
                        {/* <a href='#'>{match.params.id}</a>
                        <h1>{match.params.id}</h1> */}
                        <p>
                            Created by{' '}
                            <span class='text-primary'>
                                {accUsername(art?.tokenCreator)}
                            </span>
                        </p>
                        <p>
                            Owned by{' '}
                            <span class='text-primary'>
                                {accUsername(art?.tokenOwner)}
                            </span>
                        </p>
                        <div
                            className='card py-3'
                            style={{
                                width: '30rem'
                            }}>
                            <p className='text-secondary'>Current price</p>
                            <h4>
                                {Web3.utils.fromWei(
                                    art?.tokenSellPrice.toString(),
                                    'ether'
                                )}{' '}
                                ETH
                                <small>
                                    <span className='text-secondary'>
                                        (
                                        {(
                                            Web3.utils.fromWei(
                                                art?.tokenSellPrice.toString(),
                                                'ether'
                                            ) * ethPrice[dropdownValue]
                                        ).toFixed(2)}{' '}
                                        )
                                    </span>
                                </small>
                                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                                    <DropdownToggle caret>
                                        Choose your currency
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        {Object.keys(ethPrice).map(
                                            (keyName, idx) => {
                                                return (
                                                    <DropdownItem
                                                        onClick={changeValue}
                                                        key={idx}>
                                                        {keyName}
                                                    </DropdownItem>
                                                );
                                            }
                                        )}
                                    </DropdownMenu>
                                </Dropdown>
                            </h4>

                            {buyOrSell()}
                        </div>
                    </div>
                </div>
                <div className='my-5'>
                    <Card
                        className='card'
                        style={{
                            overflow: 'auto'
                        }}>
                        <CardHeader
                            className='text-left'
                            style={{
                                backgroundColor: '#fff'
                            }}>
                            <h4>
                                <i class='fas fa-arrows-alt-v'></i> Trading
                                History
                            </h4>
                        </CardHeader>
                        <React.Fragment>
                            <CardBody>
                                <Table
                                    style={{
                                        width: '100%'
                                    }}>
                                    <thead>
                                        <tr className='text-secondary'>
                                            <th>Event</th>
                                            <th>Price</th>
                                            <th>From</th>
                                            <th>To</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <TableBody cre={creValue} />
                                </Table>
                            </CardBody>
                        </React.Fragment>
                    </Card>
                </div>
                <Modal
                    isOpen={purchaseSuccess}
                    toggle={togglePurchaseSuccess}
                    className='modal-xl'>
                    <ModalHeader toggle={togglePurchaseSuccess}>
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
                            You have successfully made the purchase!
                        </p>
                        <Link
                            to='/mycollections'
                            style={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                            <button className='upload-more-btn'>
                                VIEW MY COLLECTIONS
                            </button>
                        </Link>
                    </ModalBody>
                </Modal>

                <Modal
                    isOpen={bidSuccess}
                    toggle={toggleBidSuccess}
                    className='modal-xl'>
                    <ModalHeader toggle={toggleBidSuccess}>
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
                            You have successfully placed a bid!
                        </p>
                        <Link
                            to='/allart'
                            style={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                            <button className='upload-more-btn'>
                                GO BACK TO ART MARKETPLACE
                            </button>
                        </Link>
                    </ModalBody>
                </Modal>
            </div>
        </>
    );
};

export default CardDetail;
