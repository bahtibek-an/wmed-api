import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

enum QueueStatus {
  ACTIVE = 'ACTIVE', // the user is added to the queue
  WAITING = 'WAITING', // the doctor is received the user

  FINISHED = 'FINISHED' // the user finished the appointment
}

@Injectable()
export class QueueService {
  constructor(
    private readonly userService: UserService,
  ) {
  }

  private queue: { patientId: number; position: number, status: QueueStatus }[] = [];

  addPatient(patientId: number): number {
    const position = this.queue.length + 1;
    this.queue.push({ patientId, position, status: QueueStatus.ACTIVE });
    return position;
  }

  removePatient(patientId: number) {
    this.queue = this.queue.filter(patient => patient.patientId !== patientId);
    this.updatePositions();
  }

  async getQueue() {
    const patients = this.queue;
    const users = await this.userService.findUsersByIds(patients.map((item => item.patientId)));
    return users.map(user => {
      const patient = patients.find(p => p.patientId === user.id);
      return {
        ...user,
        position: patient.position,
        status: patient.status,
      };
    });
  }

  async isPatientExists(patientId: number) {
    const user = await this.userService.findOne(patientId);
    if (!user) {
      return false;
    }
    return true;
  }

  private updatePositions() {
    this.queue.forEach((patient, index) => {
      patient.position = index + 1;
    });
  }

}
