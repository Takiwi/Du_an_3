import { SetMetadata } from '@nestjs/common';

export const SKIP_TRANSFORM = 'skipTransform';
export const SkipResponseTransform = () => SetMetadata(SKIP_TRANSFORM, true);
