import { Card, Box, styled, Image, Avatar } from '@chakra-ui/react'

interface Props {
    address?: string
}

export default function ChainAddressMini({ address }: Props) {
    if (!address) return <></>
    return (
        <>
            <Box>
        <span style={{ marginLeft: '5px' }}>
          {address.substring(0, 6)}...{address.substring(address.length - 6)}
        </span>
            </Box>
        </>
    )
}
