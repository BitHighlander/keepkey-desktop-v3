/*
        KeepKey Desktop
            Highlander


      Wallet Connect rebuild
 */
import { Toaster } from 'react-hot-toast'
import {
    Box,
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    SimpleGrid,
    useDisclosure,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import UpdateElectron from '@/components/update'
import SessionProposal from '@/components/SessionProposal'
import logoVite from './assets/logo-vite.svg'
import logoElectron from './assets/logo-electron.svg'
import { ChakraProvider, useColorMode } from "@chakra-ui/react";
import { theme } from "./styles/theme";
import './App.css'
const { ipcRenderer } = require('electron');
console.log('[App.tsx]', `Hello world from Electron ${process.versions.electron}!`)

function App() {
  const [count, setCount] = useState(0)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState(null);
  const [pairingCode, setPairingCode] = useState('');
  const [proposal, setProposal] = useState(null);
  const [eip155Addresses, setEip155Addresses] = useState(null);
  const [addresses, setAddresses] = useState(null);
  const [isPairingCodeValid, setIsPairingCodeValid] = useState(false);

    const handlePairingCodeChange = (event: { target: { value: any; }; }) => {
        const { value } = event.target;
        setPairingCode(value);
        // Add your validation logic for the pairing code here
        setIsPairingCodeValid(value.trim() !== ''); // Example: Pairing code is valid if it's not empty
    };

    const handleSubmit = () => {
        console.log("pairingCode: ",pairingCode);
        // Handle form submission here
        if (isPairingCodeValid) {
            ipcRenderer.send('pair', pairingCode);
            // Perform actions when the pairing code is valid
            console.log('Pairing code submitted:', pairingCode);
            onClose();
        }
    };

    const openModal = (type: any) => {
        setModalType(type);
        onOpen();
    };
  
    const onStart = async function () {
        try {


            ipcRenderer.on('onWalletStart', (event, message) => {
                console.log("onWalletStart message: ",message);
                if(!message.eip155Addresses) throw Error("Invalid onWalletStart")
                setEip155Addresses(message.eip155Addresses);
            });

            ipcRenderer.on('onSessionProposal', (event, message) => {
                console.log("onSessionProposal message: ",message);
                if(!message.proposal) throw Error("Invalid onSessionProposal")
                setProposal(message.proposal);
                openModal('onSessionProposal');
            });

            // eslint-disable-next-line no-console
            console.log("onStart())");
            ipcRenderer.send('onStart');
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
        }
    };

    // onstart get data
    useEffect(() => {
        onStart();
    }, []);
  
  return (
    <div className='App'>
        <ChakraProvider theme={theme}>
            <Modal isOpen={isOpen} onClose={() => onClose()} size="xl">
                <ModalOverlay />
                <ModalContent >
                    <ModalHeader>{modalType}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {/* Render content based on modalType */}
                        {modalType === 'Connect' && (
                            <div>
                                Connect wallet connect
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="pairingCode">Pairing Code:</label>
                                        <input
                                            type="text"
                                            id="pairingCode"
                                            name="pairingCode"
                                            value={pairingCode}
                                            onChange={handlePairingCodeChange}
                                        />
                                        {/* Display an error message if the pairing code is invalid */}
                                        {!isPairingCodeValid && <span className="error">Pairing code is required.</span>}
                                    </div>
                                </form>
                                <Button colorScheme="blue" onClick={handleSubmit}>
                                    Submit
                                </Button>
                            </div>
                        )}
                        {modalType === 'onSessionProposal' && (
                            <div>
                                onSessionProposal
                                <SessionProposal proposal={proposal} eip155Addresses={eip155Addresses} onClose={onClose}/>
                            </div>
                        )}
                        {modalType === 'Confirm Trade' && (
                            <div>

                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <div className='logo-box'>
                <a href='https://github.com/electron-vite/electron-vite-react' target='_blank'>
                    <img src={logoVite} className='logo vite' alt='Electron + Vite logo' />
                    <img src={logoElectron} className='logo electron' alt='Electron + Vite logo' />
                </a>
            </div>
            <h1>KeepKey Desktop</h1>
            <br />
            eip155Addresses: {eip155Addresses}
            <br/>
            <Button onClick={() => {openModal('Connect')}}>Connect</Button>
            <br/>
            <br/>
            <br/>
            <UpdateElectron />
        </ChakraProvider>
    </div>
  )
}

export default App
