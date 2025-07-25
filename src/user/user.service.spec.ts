import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../common/prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;
  let prismaServiceMock: {
    user: {
      create: jest.Mock;
      findById: jest.Mock;
      findByEmail: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  }
  beforeEach(async () => {
    prismaServiceMock = {
      user: {
        create: jest.fn(),
        findById: jest.fn(),
        findByEmail: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be able to create a user', async () => {
    const fakeUser = {
      name: 'paulinho',
      email: 'paulinhodomine@gmail.com',
      password: 'oxipaulinhooxi',
    }

    prismaServiceMock.user.create.mockResolvedValue(fakeUser);

    const dto = {
      name: fakeUser.name,
      email: fakeUser.email,
      password: fakeUser.password,
    }

    const result = await service.create(dto);
    expect(result).toEqual(fakeUser);
    expect(prismaServiceMock.user.create).toHaveBeenCalledWith({
      data: {
        ...dto,
      }
    })
  });

  it('should be able to throw error if user already exists', async () => {
    prismaServiceMock.user.findUnique.mockResolvedValue({
      id: 'user123',
      name: 'pedro',
      email: 'pedrinhodofortnite',
      password: 'bigchillingtrembala',
    });
    
    const dto = {
      name: 'pedro',
      email: 'pedrinhodofortnite',
      password: 'bigchillingtrembala',
    }

    await expect(service.create(dto)).rejects.toThrow('User already exists');
  })

  it('should be able to find an user by id', async () => {
    const fakeUser = {
      id: 'user123',
      name: 'paulinho',
      email: 'paulinhodomine@gmail.com',
      password: 'oxipaulinhooxi',
    }

    prismaServiceMock.user.findUnique.mockResolvedValue(fakeUser);
    const result = await service.findById(fakeUser.id);
    expect(result).toEqual(fakeUser);
    expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
      where: {
        id: fakeUser.id,
      } 
    })
  })

  it('should be able to throw error if user does not exists', async () => {
    prismaServiceMock.user.findUnique.mockResolvedValue(null);
    await expect(service.findByEmail('nossssshumilhadooooo')).rejects.toThrow('User not found');
  })  

  it('should be able to find an user by email', async () => {
    const fakeUser = {
      id: 'user234',
      name: 'lordpepino06',
      email: 'lordpepino06@gmail.com',
      password: 'pedrinhodascardourada2013',
    }

    prismaServiceMock.user.findUnique.mockResolvedValue(fakeUser);
    const result = await service.findByEmail(fakeUser.email);
    expect(result).toEqual(fakeUser);
    expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
      where: { 
        email: fakeUser.email,
       }
    })
  })
  
  it('should be able to update a user', async () => {
    const fakeUser = {
      id: 'user456',
      name: 'itzPedrin150',
      email: 'itzPedrin150@gmail.com',
      password: 'ruladoestoporadoamassado11',
    }

    prismaServiceMock.user.findUnique.mockResolvedValue(fakeUser);

    const newName = {
      name: 'PumpedByAnubis',
    }

    prismaServiceMock.user.update.mockResolvedValue({ ...fakeUser, ...newName });
    const result = await service.update(fakeUser.id, newName);
    expect(result).toEqual({ ...fakeUser, ...newName });
    expect(prismaServiceMock.user.update).toHaveBeenCalledWith({
      where: {
        id: fakeUser.id,
      },

      data: newName,
    })
  })

  it('should be able to delete a user', async () => {
    const fakeUser = {
      id: 'user789',
      name: 'LewandowskiM10',
      email: 'LewandowskiM10@gmail.com',
      password: 'reidaequipetumulto2019',
    }

    prismaServiceMock.user.findUnique.mockResolvedValue(fakeUser);
    prismaServiceMock.user.delete.mockResolvedValue(fakeUser);
    const result = await service.delete(fakeUser.id);
    expect(result).toEqual(fakeUser);
    expect(prismaServiceMock.user.delete).toHaveBeenCalledWith({
      where: {
        id: fakeUser.id,
      }
    })
  })
});
