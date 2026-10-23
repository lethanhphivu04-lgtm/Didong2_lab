import { PoseAnalyzer, PoseFeedback } from '../types';

export class MockPoseAnalyzer implements PoseAnalyzer {
  private repCounter: number = 7;
  private targetReps: number = 12;

  async analyzeFrame(_imageUri: string, exerciseId: string): Promise<PoseFeedback> {
    // ponytail: Giai đoạn 1 giả lập phân tích khung xương cho 3 bài: squat, plank, lunge.
    // Sẽ thay thế bằng TensorFlow.js / MoveNet / MediaPipe trong giai đoạn phát triển backend/native AI.
    if (exerciseId === 'squat') {
      return {
        kneeAngleDegrees: 92,
        postureStatus: 'warning',
        warningMessage: 'LƯNG HƠI CONG',
        correctionTip: 'Mở ngực, nhìn thẳng phía trước',
        completedReps: this.repCounter,
        targetReps: this.targetReps,
      };
    }

    if (exerciseId === 'plank') {
      return {
        kneeAngleDegrees: 180,
        postureStatus: 'good',
        warningMessage: 'TƯ THẾ TỐT',
        correctionTip: 'Giữ chặt cơ bụng, hít thở đều',
        completedReps: 25,
        targetReps: 40,
      };
    }

    // Default / Lunge
    return {
      kneeAngleDegrees: 90,
      postureStatus: 'good',
      warningMessage: 'GÓC GỐI CHUẨN',
      correctionTip: 'Giữ thân người thẳng',
      completedReps: 5,
      targetReps: 10,
    };
  }

  reset(): void {
    this.repCounter = 0;
  }
}

export const poseAnalyzer = new MockPoseAnalyzer();
