import { BadRequestException, HttpStatus } from '@nestjs/common'
import { ZodValidationException } from './exception'

import { z as actualZod } from 'zod'
import { z as nestjsZod } from '@nest-zod/z'

describe.each([
  ['zod', actualZod],
  ['@nest-zod/z', nestjsZod],
])('ZodValidationException (using %s)', (description, z) => {
  it('should correctly create exception', () => {
    const UserSchema = z.object({
      username: z.string(),
      password: z.string(),
    })

    const invalidUser = {
      username: 123,
      password: true,
    }

    const result = UserSchema.safeParse(invalidUser)
    expect(result.success).toBe(false)
    if (result.success) return

    const error = new ZodValidationException(result.error)
    expect(error).toBeInstanceOf(BadRequestException)
    expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST)
    expect(error.message).toBe('Validation failed')
    expect(error.getZodError()).toBe(result.error)
  })
})
