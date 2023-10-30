import { getChainData } from '@/data/chainsUtil'
import { Card, Box, styled, Image, Avatar } from '@chakra-ui/react'
import { ReactNode, useMemo } from 'react'

interface Props {
    chainId?: string // namespace + ":" + reference
}

// const StyledLogo = styled(Image, {})

export default function ChainDataMini({ chainId }: Props) {
    const chainData = useMemo(() => getChainData(chainId), [chainId])
    console.log(chainData)

    if (!chainData) return <></>
    return (
        <>
            <Box>
                <Avatar size={'xs'} src={chainData.logo} />
    <span style={{ marginLeft: '5px' }}>{chainData.name}</span>
    </Box>
    </>
)
}
