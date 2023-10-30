/*
    Session Proposal Modal
 */

// import { Fragment, useCallback, useMemo } from 'react'
import { Box, Flex, Text, Grid, GridItem, Button } from "@chakra-ui/react";
// import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
// import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils'

// import ProjectInfoCard from '@/components/ProjectInfoCard'
// import { EIP155_CHAINS, EIP155_SIGNING_METHODS } from '@/data/EIP155Data'
// import ChainDataMini from '@/components/ChainDataMini'
// import ChainAddressMini from '@/components/ChainAddressMini'
// import { getChainData } from '@/data/chainsUtil'
// import VerifyInfobox from '@/components/VerifyInfobox'
const { ipcRenderer } = require('electron');

export default function SessionProposalModal({requestEvent, requestSession, onClose}: any) {


    // handle approve action, construct session requestEvent
    async function onApprove() {
        if (requestEvent) {
            console.log('approving requestEvent:', requestEvent)
            try {
                ipcRenderer.send('approveSessionRequest', {
                    requestEvent
                });
                onClose()
            } catch (e) {
                console.error(e)
                //styledToast((e as Error).message, 'error')
                return
            }
        }
    }

    // Hanlde reject action
    async function onReject() {
        if (requestEvent) {
            try {
                console.log("Rejected requestEvent")
                ipcRenderer.send('rejectSessionRequest', {
                    requestEvent
                });
                onClose()
            } catch (e) {
                console.error(e)
                //styledToast((e as Error).message, 'error')
                return
            }
        }
    }

    return (
        <Box>
            <Flex align="center">
                <Text fontSize="xl" fontWeight="bold">
                    Requested Event
                    {JSON.stringify(requestEvent)}
                </Text>
            </Flex>

            <Button
                onClick={onApprove}
            >
                Approve
            </Button>
            <Button
                onClick={onReject}
            >
                onReject
            </Button>
        </Box>
    )
}
