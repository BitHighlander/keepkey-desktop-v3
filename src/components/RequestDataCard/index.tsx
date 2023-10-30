import { CodeBlock, codepen } from 'react-code-blocks'
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
  data: Record<string, unknown>
}

/**
 * Component
 */
export default function RequestDataCard({ data }: IProps) {
  return (
    <Box>
        <Text h5>Data</Text>
        <CodeBlock
          showLineNumbers={false}
          text={JSON.stringify(data, null, 2)}
          theme={codepen}
          language="json"
        />
    </Box>
  )
}
