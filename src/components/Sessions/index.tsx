// import { web3wallet } from '@/utils/WalletConnectUtil'
import { getSdkError } from '@walletconnect/utils'
import { Fragment, useEffect, useState } from 'react'
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
    Text,
} from '@chakra-ui/react';
/**
 * Component
 */
export default function SessionProPosal() {
    const [topic, setTopic] = useState('')
    const [updated, setUpdated] = useState(new Date())
    const [loading, setLoading] = useState(false)

    //const { activeChainId } = useSnapshot(SettingsStore.state)

    // const session = web3wallet.engine.signClient.session.values.find(s => s.topic === topic)

    // if (!session) {
    //     return null
    // }

    // Get necessary data from session
    // const expiryDate = new Date(session.expiry * 1000)
    // const { namespaces } = session

    // Handle deletion of a session
    async function onDeleteSession() {
        setLoading(true)
        console.log("onDeleteSession: ")
        // await web3wallet.disconnectSession({ topic, reason: getSdkError('USER_DISCONNECTED') })
        // replace('/sessions')
        setLoading(false)
    }

    async function onSessionPing() {
        setLoading(true)
        console.log("onSessionPing: ")
        // await web3wallet.engine.signClient.ping({ topic })
        setLoading(false)
    }

    async function onSessionEmit() {
        setLoading(true)
        console.log("onSessionPing: ")
        // await web3wallet.emitSessionEvent({
        //     topic,
        //     event: { name: 'chainChanged', data: 'Hello World' },
        //     chainId: activeChainId.toString() // chainId: 'eip155:1'
        // })
        setLoading(false)
    }

    // async function onSessionUpdate() {
    //     setLoading(true)
    //     const session = web3wallet.engine.signClient.session.get(topic)
    //     const baseAddress = '0x70012948c348CBF00806A3C79E3c5DAdFaAa347'
    //     const namespaceKeyToUpdate = Object.keys(session?.namespaces)[0]
    //     const namespaceToUpdate = session?.namespaces[namespaceKeyToUpdate]
    //     await web3wallet.updateSession({
    //         topic,
    //         namespaces: {
    //             ...session?.namespaces,
    //             [namespaceKeyToUpdate]: {
    //                 ...session?.namespaces[namespaceKeyToUpdate],
    //                 accounts: namespaceToUpdate.accounts.concat(
    //                     `${namespaceToUpdate.chains?.[0]}:${baseAddress}${Math.floor(
    //                         Math.random() * (9 - 1 + 1) + 0
    //                     )}`
    //                 ) // generates random number between 0 and 9
    //             }
    //         }
    //     })
    //     setUpdated(new Date())
    //     setLoading(false)
    // }

    // function renderAccountSelection(chain: string) {
    //   if (isEIP155Chain(chain)) {
    //     return (
    //       <ProposalSelectSection
    //         addresses={eip155Addresses}
    //         selectedAddresses={selectedAccounts[chain]}
    //         onSelect={onSelectAccount}
    //         chain={chain}
    //       />
    //     )
    //   } else if (isCosmosChain(chain)) {
    //     return (
    //       <ProposalSelectSection
    //         addresses={cosmosAddresses}
    //         selectedAddresses={selectedAccounts[chain]}
    //         onSelect={onSelectAccount}
    //         chain={chain}
    //       />
    //     )
    //   } else if (isSolanaChain(chain)) {
    //     return (
    //       <ProposalSelectSection
    //         addresses={solanaAddresses}
    //         selectedAddresses={selectedAccounts[chain]}
    //         onSelect={onSelectAccount}
    //         chain={chain}
    //       />
    //     )
    //   }
    // }

    return (
        <Fragment>
            {/*<PageHeader title="Session Details" />*/}

            {/*<ProjectInfoCard metadata={session.peer.metadata} />*/}

            {/*{Object.keys(namespaces).map(chain => {*/}
            {/*    return (*/}
            {/*        <Fragment key={chain}>*/}
            {/*            <Text h4 css={{ marginBottom: '$5' }}>{`Review ${chain} permissions`}</Text>*/}
            {/*            <SessionChainCard*/}
            {/*                namespace={namespaces[chain]}*/}
            {/*                data-testid={'session-card' + namespaces[chain]}*/}
            {/*            />*/}
            {/*            <Divider y={2} />*/}
            {/*        </Fragment>*/}
            {/*    )*/}
            {/*})}*/}

            {/*<Row justify="space-between">*/}
            {/*    <Text h5>Expiry</Text>*/}
            {/*    <Text css={{ color: '$gray400' }}>*/}
            {/*        {expiryDate.toDateString()} - {expiryDate.toLocaleTimeString()}*/}
            {/*    </Text>*/}
            {/*</Row>*/}

            <Box mt={5} mb={3}>
                <Text fontSize="lg">Last Updated</Text>
                <Text color="gray.400">
                    {updated.toDateString()} - {updated.toLocaleTimeString()}
                </Text>
            </Box>

            <Box mt={5}>
                <Button
                    width="100%"
                    colorScheme="red"
                    onClick={onDeleteSession}
                    data-testid="session-delete-button"
                >
                    {loading ? 'Loading...' : 'Delete'}
                </Button>
            </Box>

            <Box mt={5}>
                <Button
                    width="100%"
                    colorScheme="blue"
                    onClick={onSessionPing}
                    data-testid="session-ping-button"
                >
                    {loading ? 'Loading...' : 'Ping'}
                </Button>
            </Box>

            <Box mt={5}>
                <Button
                    width="100%"
                    colorScheme="teal"
                    onClick={onSessionEmit}
                    data-testid="session-emit-button"
                >
                    {loading ? 'Loading...' : 'Emit'}
                </Button>
            </Box>
        </Fragment>
    )
}
