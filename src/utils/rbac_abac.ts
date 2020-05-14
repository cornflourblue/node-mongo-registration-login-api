import { AccessControl } from 'accesscontrol';
import Role from '../models/role.model';

class AccessControlLoader {

  constructor(private accessControl: AccessControl = new AccessControl()){
    this.init();
  }

  public getAccessControl = (): AccessControl => {
    return this.accessControl;
  }

  public init = async (): Promise<void> =>{
    // const roles = await Role.find().populate({path: 'permissions', select: ['resource', 'action', 'attributes']} ).select('role');
    // await this.asyncForEach(roles, async (role: any) => {
    //   this.accessControl.grant(role.role);
    //   await this.asyncForEach(role.permissions, async (permission: any) => {
    //     console.log('in permissions', permission);
    //   });
    // });

    let grantList = [
      // roles
      { role: 'owner', resource: 'role', action: 'create:any', attributes: '*, !views' },
      { role: 'owner', resource: 'role', action: 'read:any', attributes: '*' },
      { role: 'owner', resource: 'role', action: 'update:any', attributes: '*, !views' },
      { role: 'owner', resource: 'role', action: 'delete:any', attributes: '*' },

      { role: 'admin', resource: 'user', action: 'update:any', attributes: '*' },
      { role: 'admin', resource: 'user', action: 'read:any', attributes: '*' },

      // prescriptions
      { role: 'professional', resource: 'prescription', action: 'create:any', attributes: '*, !views' },
      { role: 'professional', resource: 'prescription', action: 'read:own', attributes: '*' },
      { role: 'professional', resource: 'prescription', action: 'read:any', attributes: '*' },
      { role: 'professional', resource: 'prescription', action: 'update:own', attributes: '*' },
      { role: 'professional', resource: 'prescription', action: 'delete:any', attributes: '*' },

      { role: 'pharmacist', resource: 'prescription', action: 'read:any', attributes: '*' },
      { role: 'pharmacist', resource: 'prescription', action: 'update:any', attributes: '*, !views' },

      { role: 'owner', resource: 'prescription', action: 'delete:any', attributes: '*' },

      // patients
      { role: 'professional', resource: 'patient', action: 'create:any', attributes: '*, !views' },
      { role: 'professional', resource: 'patient', action: 'read:own', attributes: '*' },

      { role: 'pharmacist', resource: 'patient', action: 'read:any', attributes: '*' },

      { role: 'owner', resource: 'patient', action: 'delete:any', attributes: '*' },

      // supplies
      { role: 'professional', resource: 'supplies', action: 'read:any', attributes: '*' },
      { role: 'pharmacist', resource: 'supplies', action: 'read:any', attributes: '*' },
      { role: 'admin', resource: 'supplies', action: 'update:any', attributes: '*' }
    ];
    this.accessControl.setGrants(grantList);
    console.log('grants initialized');
  }


  public asyncForEach = async (array: any[], callback: Function) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

}

const accessControlLoader = new AccessControlLoader();
const accessControl = accessControlLoader.getAccessControl();
export default accessControl;

