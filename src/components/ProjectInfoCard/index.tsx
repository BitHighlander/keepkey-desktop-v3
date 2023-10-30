import { useMemo } from 'react';
import {
    Avatar,
    Box,
    Link,
    Text,
    Flex,
    VStack,
    Icon,
} from '@chakra-ui/react';

/**
 * Types
 */
interface IProps {
    metadata: any; // Replace with the actual type if available
    intention?: string;
}

const StyledLink = {
    color: '#697177',
};

const StyledVerifiedIcon = {
    verticalAlign: 'middle',
    marginRight: '5px',
};

const StyledUnknownContainer = {
    padding: '7px',
    color: 'warning',
};

const StyledInvalidContainer = {
    padding: '7px',
    color: 'error',
};

/**
 * Components
 */
export default function ProjectInfoCard({ metadata, intention }: IProps) {
    // Replace the following line with your data fetching logic
    // const { currentRequestVerifyContext } = useSnapshot(SettingsStore.state);
    // const validation = currentRequestVerifyContext?.verified.validation;
    const validation = 'VALID'; // Replace with actual validation logic

    const { icons, name, url } = metadata;

    return (
        <Box textAlign="center">
            <Flex direction="column" alignItems="center">
                <Avatar src={icons[0]} size="xl" margin="auto" />
            </Flex>

            <VStack align="center" spacing={2}>
                <Text as="h3" data-testid="session-info-card-text">
                    <span>{name}</span> <br />
                    <Text as="h4"> wants to {intention ? intention : 'connect'}</Text>
                </Text>
            </VStack>

            <Flex align="center">
                {validation === 'VALID' && (
                    <>
                        {/* Icon component or custom icon */}
                        {/* <Icon as={MdReport} style={StyledVerifiedIcon} /> */}

                        <Link style={StyledLink} href={url} data-testid="session-info-card-url">
                            {url}
                        </Link>
                    </>
                )}
            </Flex>

            {false /* Replace with your condition */}
            {/* {currentRequestVerifyContext?.verified.isScam ? (
        <Box as={StyledInvalidContainer}>
          <Icon as={MdNewReleases} style={{ verticalAlign: 'bottom' }} />
          Potential threat
        </Box>
      ) : validation === 'UNKNOWN' ? (
        <Box as={StyledUnknownContainer}>
          <Icon as={MdReport} style={{ verticalAlign: 'bottom' }} />
          Cannot Verify
        </Box>
      ) : validation === 'INVALID' ? (
        <Box as={StyledInvalidContainer}>
          <Icon as={MdReportProblem} style={{ verticalAlign: 'bottom', marginRight: '2px' }} />
          Invalid Domain
        </Box>
      ) : null} */}
        </Box>
    );
}
