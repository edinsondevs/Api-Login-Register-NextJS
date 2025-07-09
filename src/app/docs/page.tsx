'use client';

import 'swagger-ui-react/swagger-ui.css';
import dynamic from 'next/dynamic';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

function ApiDocPage() {
  return (
		<SwaggerUI
			url='/openapi.json'
			docExpansion='list'
			defaultModelsExpandDepth={-1}
		/>
  );
}

export default ApiDocPage;
